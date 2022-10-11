import { useState, useRef, useEffect } from "react";

import styled from "@emotion/styled";
import css from "@emotion/css";

import { CipherInput } from "~/components/CipherInput";
import ChapterOne from "./chapters/1-one/story.mdx";

const ChapterContent = styled.div`
  max-width: 700px;
  margin: 16px auto;
`;

const EnterCipher = styled.div`
  text-align: center;
`;
const EnterCipherHeader = styled.h1``;
const EnterCipherTitle = styled.h2`
  font-weight: normal;
  margin: 0 auto;
  margin-bottom: 48px;
  max-width: 640px;
  line-height: 1.3;
`;

const Body = styled.div``;

function App() {
  const [value, setValue] = useState(0o00112233);
  const [showChapter, setShowChapter] = useState(false);

  const tries = useRef(0);

  useEffect(() => {
    if (++tries.current >= 10) {
      setShowChapter(true);
    }
  }, [value]);

  return (
    <Body>
      {!showChapter && (
        <EnterCipher>
          <EnterCipherHeader>Знаешь ли ты секретный код?</EnterCipherHeader>
          <EnterCipherTitle>
            Нет кода — нет и истории, таковы правила. Наберись терпения.
          </EnterCipherTitle>
          <CipherInput cipher={value} onChange={(x) => setValue(x)} />
        </EnterCipher>
      )}

      {showChapter && (
        <ChapterContent>
          <ChapterOne />
        </ChapterContent>
      )}
    </Body>
  );
}

export default App;
