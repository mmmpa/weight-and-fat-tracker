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
      <p>体重と体脂肪率を記録</p>
      <h2>機能</h2>
      <ul>
        <li>日次記録</li>
        <li>月別表示</li>
        <li>グラフ</li>
        <li>エクスポート/インポート</li>
      </ul>
      <h2>使い方</h2>
      <ol>
        <li>設定でDB接続</li>
        <li>月別で記録</li>
        <li>グラフで確認</li>
      </ol>
    </div>
  );
}
