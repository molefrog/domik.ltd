import styled from "@emotion/styled";
import { TV } from "~/attractions/TV";

export default function PlaygroundPage() {
  return (
    <Container>
      You can only <TV video="dQw4w9WgXcQ">see this</TV> in dev environment!
    </Container>
  );
}

const Container = styled.div`
  padding: 48px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;
