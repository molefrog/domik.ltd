import styled from "@emotion/styled";

import { symbolForOct } from "~/assets/symbols/oct";

interface Props {
  oct: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

const Cont = styled.span`
  display: inline-block;
  width: 14px;
  vertical-align: baseline;
  position: relative;
`;

const Gemstone = styled.span`
  display: inline-block;
  position: absolute;
  bottom: -2px;
  width: 18px;
  height: 20px;
  background: var(--color-embossed);
  border-radius: 3px;
  box-shadow: 0px 0.5px 0px 1px #c3c3c2, 0px 0px 0px 0.8px #c3c3c2, inset 0px 1px 0px 0px white;

  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%;
`;

/*

 */
export const Gem = (props: Props) => {
  return (
    <Cont>
      <Gemstone style={{ backgroundImage: `url(${symbolForOct(props.oct)})` }}></Gemstone>
    </Cont>
  );
};
