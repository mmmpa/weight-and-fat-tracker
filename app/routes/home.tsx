export function meta() {
  return [{ title: "1kg.app" }, { name: "description", content: "体重と体脂肪率を記録" }];
}

export default function Home() {
  return (
    <div>
      <h2>使い方</h2>
      <ol>
        <li>設定でTurso接続</li>
        <li>体重と体脂肪を記録</li>
      </ol>
      <h2>特徴</h2>
      <ul>
        <li>バックエンドサーバー無し</li>
        <li>Tursoへのリクエストのみ</li>
      </ul>
    </div>
  );
}
