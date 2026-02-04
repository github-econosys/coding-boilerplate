<?php $page_title = "お知らせ一覧 | Site Title"; $page_description = "最新のお知らせをご覧いただけます。"; ?>
<!doctype html>
<html lang="ja">
  <head>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/head.php'); ?>
  </head>

  <body>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php'); ?>

    <main class="l-main">
      <section class="p-news">
        <div class="l-container">
          <h2>お知らせ一覧</h2>
          <ul class="p-news__list">
            <li><a href="/news/detail/">2024.01.01 お知らせタイトル 1</a></li>
            <li><a href="/news/detail/">2024.01.02 お知らせタイトル 2</a></li>
          </ul>
        </div>
      </section>
    </main>

    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php'); ?>
  </body>
</html>
