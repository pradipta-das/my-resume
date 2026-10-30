// The MySQL Query Tuning Cheatsheet (PDF). Every query and measurement here
// was run against MySQL with a WordPress/WooCommerce-shaped test database
// (100,000 products, 2.25 million postmeta rows). Rebuild with
// `npm run resources -- mysql-query-tuning-cheatsheet`.
import { createElement as h } from "react";
import { BrandDocument, Check, Closing, Code, Paragraph, Section, Subhead, Term } from "./pdf.mjs";

export const file = "mysql-query-tuning-cheatsheet.pdf";

const p = (text) => h(Paragraph, { key: text.slice(0, 40), text });
const code = (text) => h(Code, { key: text.slice(0, 40) }, text);
const sub = (text) => h(Subhead, { key: text, text });
const term = (t, text) => h(Term, { key: t, term: t, text });

export function document() {
  return h(
    BrandDocument,
    {
      title: "MySQL Query Tuning Cheatsheet",
      eyebrow: "Free resource from Pradipta Das · For WordPress and WooCommerce",
      intro:
        "When a WordPress or WooCommerce site slows down, a handful of queries is often doing far more work than it should. These are the checks and fixes I come back to most, in the order I use them. Everything here runs on MySQL 8 and MariaDB 10.6 or later. Take a backup first, and try each change on a staging copy.",
      footerNote: "MySQL Query Tuning Cheatsheet · Free to use and share",
    },

    h(
      Section,
      { number: 1, title: "Find the slow queries" },
      p("Start with evidence. On WordPress, the Query Monitor plugin lists every query on a page with its time and the plugin or theme that ran it, which is often all you need. For the whole site, turn on MySQL's slow query log:"),
      code(`SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.5;               -- seconds; the default is 10
SET GLOBAL log_queries_not_using_indexes = 'ON';
SHOW VARIABLES LIKE 'slow_query_log_file';     -- where the log is written`),
      p("Leave it on for a day of normal traffic, then summarise the log by total time with `mysqldumpslow -s t -t 10 <log file>`, or with `pt-query-digest` from Percona Toolkit. Turn `log_queries_not_using_indexes` off again afterwards: on a busy site it fills the log quickly. On managed hosting without these permissions, ask your host for the slow log."),
    ),

    h(
      Section,
      { number: 2, title: "Read EXPLAIN" },
      p("Put `EXPLAIN` in front of a SELECT to see how MySQL will run it, without running it. On MySQL 8.3 or later, if you get a tree instead of a table, use `EXPLAIN FORMAT=TRADITIONAL`. The columns that matter:"),
      term("type", "How rows are found, from worst to best: `ALL` (every row in the table), `index`, `range`, `ref`, `eq_ref`, `const`. `ALL` on a large table is the first thing to fix."),
      term("key", "The index MySQL chose. `NULL` means none."),
      term("rows × filtered", "Roughly how many rows it expects to read, and the percentage it expects to keep. Many rows read and few kept means a missing or unsuitable index."),
      term("Extra", "`Using filesort` and `Using temporary` mean extra sorting or a temporary table. `Using index` is good: the index alone answered the query."),
      p("`EXPLAIN ANALYZE` (MySQL 8.0.18 or later) actually runs the query and shows real row counts and times; on MariaDB, use `ANALYZE SELECT …`. Run these on staging: they execute the query."),
    ),

    h(
      Section,
      { number: 3, title: "Add the right index" },
      h(Check, { key: "c1", text: "Put equality columns first, range columns last.", detail: "For `WHERE post_type = ? AND post_status = ? AND post_date > ?`, an index on (post_type, post_status, post_date) serves all three." }),
      h(Check, { key: "c2", text: "An index works from the left.", detail: "(a, b, c) helps queries on a, on a and b, and on all three; not queries on b or c alone." }),
      h(Check, { key: "c3", text: "Long text columns need a prefix length.", detail: "WordPress indexes `meta_key(191)` because utf8mb4 limits index size on older MySQL versions." }),
      h(Check, { key: "c4", text: "Don't index everything.", detail: "Every index slows down writes and takes space. Add one for a query you've measured, then measure again." }),
      p("Check what's there with `SHOW INDEX FROM wp_postmeta;`. InnoDB can add most indexes without blocking the site:"),
      code(`ALTER TABLE wp_postmeta
  ADD INDEX meta_key_value (meta_key(191), meta_value(32)),
  ALGORITHM=INPLACE, LOCK=NONE;`),
      p("After large imports or deletes, `ANALYZE TABLE wp_postmeta;` refreshes the statistics MySQL uses to choose an index."),
    ),

    h(
      Section,
      { number: 4, title: "wp_postmeta" },
      p("Custom fields, WooCommerce product data and many plugins all live in this one table, and WordPress only indexes `post_id` and `meta_key`. Any query that filters on `meta_value` reads every row with that key."),
      sub("Measured on the test store (100,000 products)"),
      code(`SELECT post_id FROM wp_postmeta WHERE meta_key = 'color' AND meta_value = 'blue';

-- Core indexes only:      reads 100,000 rows, about 1.25 s, keeps 8,307
-- With meta_key_value:    reads   8,307 rows, about 0.15 s`),
      p("The composite index from section 3 is the fix. Plugins such as Index WP MySQL For Speed add this kind of index for you. One limit: a numeric comparison such as `CAST(meta_value AS UNSIGNED) BETWEEN 1000 AND 2000` can't use it, because the index stores text. For WooCommerce prices, rely on the product lookup tables (section 6) rather than postmeta."),
      sub("Clear out what nothing uses"),
      code(`-- Meta rows whose post no longer exists
SELECT COUNT(*) FROM wp_postmeta pm
  LEFT JOIN wp_posts p ON p.ID = pm.post_id
  WHERE p.ID IS NULL;

-- Old revisions
SELECT COUNT(*) FROM wp_posts WHERE post_type = 'revision';`),
      p("Limit revisions from now on with `define( 'WP_POST_REVISIONS', 5 );` in wp-config.php. Delete in batches, off-peak, after a backup."),
    ),

    h(
      Section,
      { number: 5, title: "wp_options and autoload" },
      p("WordPress loads every autoloaded option on every request, before any page logic runs. Old plugins often leave large ones behind. Since WordPress 6.6, autoload is stored as `on`, `off`, `auto`, `auto-on` or `auto-off`; older sites use `yes` and `no`. This covers both:"),
      code(`-- Total autoloaded size
SELECT ROUND(SUM(LENGTH(option_value)) / 1024) AS autoload_kb
  FROM wp_options WHERE autoload IN ('yes', 'on', 'auto-on', 'auto');

-- The largest ones
SELECT option_name, ROUND(LENGTH(option_value) / 1024) AS kb
  FROM wp_options WHERE autoload IN ('yes', 'on', 'auto-on', 'auto')
  ORDER BY LENGTH(option_value) DESC LIMIT 20;`),
      p("Site Health warns when the total gets large. For a big option that isn't needed on every page, stop it autoloading with `wp_set_option_autoload( 'option_name', false );` (WordPress 6.4 or later), or delete it if it belongs to a plugin you've removed. Expired transients pile up here too: `wp transient delete --expired` clears them with WP-CLI."),
    ),

    h(
      Section,
      { number: 6, title: "WooCommerce hotspots" },
      h(Check, { key: "w1", text: "Orders use High-Performance Order Storage.", detail: "HPOS keeps orders in their own indexed tables instead of posts and postmeta, and is the default for new stores since WooCommerce 8.2. Older stores can migrate under WooCommerce › Settings › Advanced › Features." }),
      h(Check, { key: "w2", text: "The product lookup tables are up to date.", detail: "Price, stock and rating filters read `wc_product_meta_lookup`. If filters are slow or wrong after an import, regenerate it under WooCommerce › Status › Tools." }),
      h(Check, { key: "w3", text: "Action Scheduler isn't overgrown.", detail: "Background jobs are logged in `wp_actionscheduler_actions`. Completed actions are kept for 30 days by default; thousands of failed or pending ones point to a problem worth fixing." }),
      code(`SELECT status, COUNT(*) FROM wp_actionscheduler_actions GROUP BY status;`),
    ),

    h(
      Section,
      { number: 7, title: "Query patterns to avoid" },
      p("The same test database shows what each one costs. Watch for them in Query Monitor and in your own code."),
      term("YEAR(post_date) = 2024", "A function on an indexed column stops the index narrowing the search. Here it examined 96,535 rows; `post_date >= '2024-01-01' AND post_date < '2025-01-01'` examined 36,160."),
      term("LIKE '%term%'", "A leading wildcard reads the whole table (193,070 rows here). `LIKE 'term%'` used the index and read 111. For real search, use a search plugin or service."),
      term("ORDER BY RAND()", "Sorts every matching row in a temporary table to return a handful. Pick random IDs in PHP, or cache the result."),
      term("posts_per_page => -1", "Loads every matching post into memory. Paginate, or fetch IDs only with `'fields' => 'ids'`."),
      term("Large meta_query", "Each clause joins wp_postmeta again. Three or four clauses on a large store add up fast."),
      term("Found rows you don't need", "WP_Query counts all matches for pagination. Pass `'no_found_rows' => true` when you don't paginate."),
    ),

    h(
      Section,
      { number: 8, title: "Check the server" },
      code(`-- How big each table is
SELECT table_name, ROUND((data_length + index_length) / 1024 / 1024) AS mb
  FROM information_schema.tables WHERE table_schema = DATABASE()
  ORDER BY (data_length + index_length) DESC LIMIT 10;

-- How often InnoDB had to go to disk
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';`),
      p("`Innodb_buffer_pool_reads` (from disk) should be a small fraction of `Innodb_buffer_pool_read_requests`. If it isn't, and the busy tables are larger than `innodb_buffer_pool_size`, the database needs more memory: on a server you manage, give the buffer pool most of the RAM the database can use. A persistent object cache such as Redis also takes repeated queries off MySQL."),
    ),

    h(
      Section,
      { number: 9, title: "Safe habits" },
      h(Check, { key: "s1", text: "Back up before every change.", detail: "`mysqldump --single-transaction --quick db_name > backup.sql` takes a consistent copy without locking InnoDB tables, or use `wp db export`." }),
      h(Check, { key: "s2", text: "Work on staging first.", detail: "With a recent copy of the live data, so the row counts are realistic." }),
      h(Check, { key: "s3", text: "Change one thing at a time.", detail: "EXPLAIN and time the query before and after, and keep the change only if it helps." }),
      h(Check, { key: "s4", text: "Schedule big changes for quiet hours.", detail: "Adding an index to a multi-gigabyte table can take minutes and slow the server while it runs." }),
      h(Check, { key: "s5", text: "Write down what you added.", detail: "Custom indexes can be lost when a table is rebuilt by a migration or a plugin." }),
    ),

    h(Closing, {
      title: "Still slow?",
      text: "Send me the slowest query from your log, and we'll look at it together on a free call:",
      href: "https://pradipta.online/free-consultation",
      label: "pradipta.online/free-consultation",
    }),
  );
}
