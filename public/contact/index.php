<?php $page_title = "お問い合わせ | Site Title"; $page_description = "お問い合わせはこちらから。"; ?>
<!doctype html>
<html lang="ja">
  <head>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/head.php'); ?>
  </head>

  <body>
    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php'); ?>

    <main class="l-main">
      <section class="p-contact">
        <div class="l-container">
          <h2>お問い合わせ</h2>
          <form action="/contact/confirm/" method="get">
            <label> お名前: <input type="text" name="name" placeholder="例）山田 太郎" /> </label>
            <label>
              お問い合わせ種別:
              <select name="category">
                <option value="">選択してください</option>
                <option value="general">一般的なお問い合わせ</option>
                <option value="business">ビジネスのご提案</option>
                <option value="other">その他</option>
              </select>
            </label>
            <label>
              お問い合わせ内容:
              <textarea
                name="message"
                rows="5"
                placeholder="お問い合わせ内容を入力してください"
              ></textarea>
            </label>
            <button type="submit">確認画面へ</button>
          </form>
        </div>
      </section>
    </main>

    <?php include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php'); ?>
  </body>
</html>
