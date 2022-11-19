import { useState, Fragment } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Flipper, Flipped } from "react-flip-toolkit";

export const HouseBuilder = () => {
  const [items, setItems] = useState([9, 8, 7]);

  // opens in a new window by default
  return (
    <Container>
      <button
        onClick={() => setItems((it) => [it[0], Math.floor(Math.random() * 1000), ...it.slice(1)])}
      >
        +
      </button>
      <button onClick={() => setItems((it) => it.slice(1))}>-</button>

      <Flipper flipKey={items.length}>
        <Grid>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <Fragment key={item}>
                <Flipped flipId={item}>
                  <Item />
                </Flipped>
                {!isLast && <Separator />}
              </Fragment>
            );
          })}
        </Grid>
      </Flipper>
    </Container>
  );
};

24

/**
 * Styles
 */

const Container = styled.div``;

const Grid = styled.div`
  --grid-step: 28px;
  aspect-ratio: 1 / 1;
  overflow-y: auto;

  background: var(--color-embossed);
  padding: calc(var(--grid-step));
  border-radius: 6px;

  display: grid;
  grid-template-columns:
    repeat(2, var(--grid-step))
    [start] repeat(2, var(--grid-step))
    [wall-start] repeat(6, var(--grid-step))
    [wall-end] repeat(2, var(--grid-step))
    [end]
    repeat(2, var(--grid-step));

  grid-auto-rows: var(--grid-step);
  justify-content: center;
`;

const Item = styled.div`
  grid-column: wall-start / wall-end;
  grid-row-end: span 3;
  background: rebeccapurple;
`;

const Separator = styled.div`
  grid-column: start / end;
  grid-row-end: span 2;

  background: gray;
  opacity: 0.2;
`;
