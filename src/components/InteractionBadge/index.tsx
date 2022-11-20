import styled from "@emotion/styled";
import { ComponentProps } from "react";
import { WonderingEyes } from "~/attractions/EyedLink";

type Props = ComponentProps<"div"> & { size?: number };

export const InteractionBadge = ({ children, size = 42, ...props }: Props) => {
  return (
    <Children {...props}>
      {children}

      <Badge style={{ "--size": `${size}px` } as React.CSSProperties}>
        <WonderingEyes />
      </Badge>
    </Children>
  );
};

const Children = styled.div`
  position: relative;
`;

const Badge = styled.div`
  --size: 42px;
  width: var(--size);
  height: var(--size);
  border-radius: 100%;
  position: absolute;
  bottom: -12px;
  left: calc(50% - 0.5 * var(--size) / 2);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--size) * 0.47);
  box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 5%), 0px 1px 6px 0px rgb(0 0 0 / 10%);
`;
