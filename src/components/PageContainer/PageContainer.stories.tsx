import { Meta, StoryFn } from "@storybook/react";
import PageContainer, { PageContainerProps } from "./PageContainer";
import "../components/PageContainer.css"; // 필요시 CSS 파일도 가져오기

export default {
  title: "Components/PageContainer",
  component: PageContainer,
} as Meta;

const Template: StoryFn<PageContainerProps> = (args) => (
  <PageContainer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "Default Title",
  content: <p>This is the default content</p>,
  onClose: () => alert("Closed"),
};

export const WithCustomContent = Template.bind({});
WithCustomContent.args = {
  title: "Custom Title",
  content: (
    <div>
      <p>This is custom content</p>
      <button onClick={() => alert("Button clicked")}>Click Me</button>
    </div>
  ),
  onClose: () => alert("Closed"),
};
