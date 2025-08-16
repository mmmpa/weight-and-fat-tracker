export function meta() {
  return [
    { title: "1kg" },
    { name: "description", content: "Track your weight and body fat percentage" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>1kg</h1>

      <h2>ようこそ</h2>
      <p>このシンプルなアプリケーションで体重と体脂肪率を時系列で記録・管理できます。</p>

      <h3>機能</h3>
      <p>
        <strong>日次記録</strong>
        <br />
        毎日の体重と体脂肪率の測定値を記録
        <br />
        <br />
        <strong>月別表示</strong>
        <br />
        カレンダー形式で月別記録を表示・編集
        <br />
        <br />
        <strong>グラフ</strong>
        <br />
        インタラクティブなグラフで進捗と傾向を視覚化
        <br />
        <br />
        <strong>エクスポート/インポート</strong>
        <br />
        データをJSONでエクスポートまたはバックアップファイルからインポート
      </p>

      <h3>データ保存</h3>
      <p>
        全てのデータはTursoデータベースを使用して保存されます。
        <br />
        設定セクションでデータベース接続を構成してください。
      </p>

      <h3>はじめに</h3>
      <p>
        1. 設定セクションでデータベース接続を構成
        <br />
        2. 月別表示で日々の測定値の記録を開始
        <br />
        3. グラフ視覚化で進捗を追跡
      </p>
    </div>
  );
}
