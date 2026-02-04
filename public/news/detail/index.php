<?php $page_title = "お知らせ詳細 | Site Title"; $page_description = "お知らせの詳細ページです。"; ?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/head.php'); ?>
</head>

<body>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php'); ?>

    <main class="l-main">
        <section class="p-news-detail">
            <div class="l-container">
                <h2>お知らせ詳細</h2>
                <article>
                    <time>2024.01.01</time>
                    <h3>お知らせタイトル</h3>
                    <div class="u-mt-20">
                        <img src="/assets/images/sample/placeholder.png" alt="サンプル画像" width="600" height="400">
                    </div>
                    <p class="u-mt-20">ここにお知らせの詳細内容が入ります。</p>
                    <a href="/news/">一覧へ戻る</a>
                </article>
            </div>
        </section>
    </main>

    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php'); ?>
</body>

</html>