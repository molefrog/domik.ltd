import styled from "@emotion/styled";
import { ReactNode } from "react";

export const Credits = styled.div`
  margin: 80px 0 0 0;
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

export interface CreditProps {
  children: ReactNode;
  title: ReactNode;
}

export const Credit = ({ children, title }: CreditProps) => {
  return (
    <CreditBlock>
      <h4>{title}</h4>
      {children}
    </CreditBlock>
  );
};

const CreditBlock = styled.div`
  > h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
  }
`;
