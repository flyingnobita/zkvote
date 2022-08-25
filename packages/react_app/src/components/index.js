import styled from "styled-components";

export const Container = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  font-family: "Harukaze";
`;

export const Header = styled.header`
  background-color: #ffffff;
  color: black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  text-align: center;
  margin-top: 15px;
`;

export const Body = styled.div`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  margin-top: 20px;
  padding-bottom: 80px;
`;

export const Title = styled.h1`
  display: flex;
  color: #282c34;
  text-align: center;
  max-width: 80%;
`;

export const DivFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

export const DivPassword = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin: 0px 20px 20px 20px;
`;

export const LabelPassword = styled.label`
  font-size: 1em;
  color: #282c34;
`;

export const InputPassword = styled.input`
  border: none;
  border-bottom: 2px solid #282c34;
  font-family: "Harukaze";
  color: #ab2424;
  font-size: 1em;
  margin-top: 4px;
  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  background-color: white;
  border: solid;
  border-radius: 2px;
  color: #282c34;
  cursor: pointer;
  font-size: 20px;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
  font-family: "Harukaze";
`;

export const DivStatus = styled.div`
  margin-top: 15px;
  text-align: center;
  color: #ab2424;
  font-family: "Harukaze";
  font-size: 1em;
  margin: 30px 0px 20px 0px;
`;

export const Image = styled.img`
  height: 35vmin;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #2850a6;
  margin-top: 8px;
  text-decoration: none;
`;

export const BottomText = styled.div`
  font-family: "Harukaze";
  color: #282c34;
  font-size: 1.5em;
  text-align: center;
`;

export const PriceText = styled.div`
  font-family: "Harukaze";
  margin: 0px 0px 20px 0px;
  color: #282c34;
  font-size: 1.25em;
  text-align: center;
`;

export const LinkLogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LinkLogo = styled.img`
  height: 7vmin;
  margin: 0px 5px 0px 5px;
`;

export const DivScrollable = styled.div`
  overflow-y: scroll;
  height: 200px;
  width: 100%;
`;

export const Pre = styled.pre`
  border: 10;
  border-color: black;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`;

export const Textarea = styled.textarea`
  width: 100%;
  font-family: monospace;
  font-size: 1em;
`;

export const DivTooltipText = styled.div`
  visibility: hidden;
  width: max-content;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 5px 5px 5px;
  top: -30px;
  left: -90px;

  font-size: 0.5em;
  font-family: monospace;
  text-align: left;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
`;

export const DivTooltip = styled.div`
  position: relative;
  display: inline-block;
  color: #ab2424;
  /* border-bottom: 1px dotted black; */

  &:hover ${DivTooltipText} {
    visibility: visible;
  }
`;

export const Details = styled.details.attrs((props) => ({
  open: true,
}))`
  color: #282c34;
  cursor: pointer;
`;

export const Summary = styled.summary`
  /* color: #282c34; */
  font-size: 0.7em;
  font-family: monospace;
`;

export const ZkDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #282c34;
  background-color: #f1f1f1;
  padding: 20px;
  font-family: monospace;
  font-size: 0.5em;
`;

export const DivLeftAlign = styled.div`
  float: right;
  width: 80%;
  padding: 10px;
`;

export const DetailButton = styled.button`
  background-color: white;
  border: solid;
  border-width: 1px;
  border-radius: 2px;
  color: #282c34;
  cursor: pointer;
  font-size: 1em;
  padding: 5px;
  margin: 10px 0 0 0;
  text-align: center;
  text-decoration: none;
  font-family: monospace;
  width: 30%;
`;

export const DivFlexInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: flex-start;
  align-items: center;
  width: 100%;
`;

export const DivFlexInput = styled.input`
  border: none;
  /* border-bottom: 2px solid #282c34; */
  font-family: monospace;
  /* color: #ab2424; */
  font-size: 1em;
  margin-top: 4px;
  flex-grow: 4;
  &:focus {
    outline: none;
  }
`;

export const DivFlexFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

export const DivFlexForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: flex-start;
  width: 100%;
`;

export const ZKDetailStatus = styled.div`
  margin-top: 15px;
  text-align: center;
  color: #ab2424;
  font-family: monospace;
  font-size: 1em;
  margin: 30px 0px 20px 0px;
`;

export const ToggleWrapper = styled.div`
  position: relative;
`;

export const ToggleLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 62px;
  height: 26px;
  border-radius: 15px;
  background: yellow;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

export const Toggle = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 62px;
  height: 26px;
  &:checked + ${ToggleLabel} {
    background: #4fbe79;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 41px;
      transition: 0.2s;
    }
  }
`;

export const ToggleLabelExternal = styled.div`
  font-size: 10;
  color: black;
  margin: 0px 20px 10px 10px;
`;

export const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
