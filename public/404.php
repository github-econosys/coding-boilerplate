<?php $page_title = "ページが見つかりません | Site Title"; $page_description = "ディスクリプションが入ります。"; ?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/head.php'); ?>
</head>

<body>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php'); ?>

    <main class="l-main">
        <section class="p-not-found">
            <div class="l-container">
                <h2>404 Not Found</h2>
                <p>The page you are looking for does not exist.</p>
                <a href="/">Back to Home</a>
            </div>
        </section>
    </main>

    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php'); ?>
</body>

</html>