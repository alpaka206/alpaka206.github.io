import { Meta, StoryFn } from "@storybook/react";
import FolderContainer, { FolderContainerProps } from "./FolderContainer";
import "./FolderContainer.css";

export default {
  title: "Components/FolderContainer",
  component: FolderContainer,
  //   argTypes: {
  //     imageUrl: { control: "text" },
  //     title: { control: "text" },
  //   },
} as Meta;

const Template: StoryFn<FolderContainerProps> = (args) => (
  <FolderContainer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  imageUrl: "./assets/AboutMe.png",
  title: "Example Folder",
};
