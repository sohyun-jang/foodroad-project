import React from "react";
import Header from "../components/Header";

function Main() {
  return (
    <>
      <Header />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>푸드로드에 오신 것을 환영합니다!</h1>
        <p>행사 정보를 쉽게 찾고, 더 높은 수익을 만들어보세요.</p>
      </main>
    </>
  );
}

export default Main;
