<!DOCTYPE html>
<html lang="ja">

<head>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/head.php'); ?>
</head>

<body>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php'); ?>

    <main class="l-main">
        <section class="p-contact-confirm">
            <div class="l-container">
                <h2>お問い合わせ内容確認</h2>
                <p>以下の内容で送信します。よろしければ「送信する」ボタンを押してください。</p>
                <form action="/contact/complete/" method="get">
                    <dl class="p-contact-confirm__list">
                        <div class="p-contact-confirm__item">
                            <dt>お名前</dt>
                            <dd>山田 太郎</dd>
                        </div>
                        <div class="p-contact-confirm__item">
                            <dt>お問い合わせ種別</dt>
                            <dd>一般的なお問い合わせ</dd>
                        </div>
                        <div class="p-contact-confirm__item">
                            <dt>お問い合わせ内容</dt>
                            <dd>これはサンプルメッセージです。\nこんにちは。</dd>
                        </div>
                    </dl>

                    <div class="p-contact-confirm__actions">
                        <button type="button" class="c-button c-button--secondary" onclick="history.back()">戻る</button>
                        <button type="submit" class="c-button c-button--primary">送信する</button>
                    </div>
                </form>
            </div>
        </section>
    </main>

    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php'); ?>
</body>

</html>