import { jsx as _jsx } from "react/jsx-runtime";
import FolderContainer from "./FolderContainer";
import "./FolderContainer.css";
export default {
    title: "Components/FolderContainer",
    component: FolderContainer,
    //   argTypes: {
    //     imageUrl: { control: "text" },
    //     title: { control: "text" },
    //   },
};
const Template = (args) => (_jsx(FolderContainer, { ...args }));
export const Default = Template.bind({});
Default.args = {
    imageUrl: "./assets/AboutMe.png",
    title: "Example Folder",
};
