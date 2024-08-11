import { Meta, StoryFn } from "@storybook/react";
import PageContainer, { PageContainerProps } from "./PageContainer";
import * as styles from "./PageContainer.css";

export default {
  title: "Components/PageContainer",
  component: PageContainer,
} as Meta;

const Template: StoryFn<PageContainerProps> = (args) => (
  <PageContainer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tabs: [
    {
      title: "Tab 1",
      imageUrl: "https://via.placeholder.com/20", // 탭의 아이콘을 위한 이미지 URL
      content: (
        <div className={styles.tabContent}>This is the content for Tab 1</div>
      ),
    },
    {
      title: "Tab 2",
      imageUrl: "https://via.placeholder.com/20", // 탭의 아이콘을 위한 이미지 URL
      content: (
        <div className={styles.tabContent}>This is the content for Tab 2</div>
      ),
    },
    {
      title: "Tab 3",
      imageUrl: "https://via.placeholder.com/20", // 탭의 아이콘을 위한 이미지 URL
      content: (
        <div className={styles.tabContent}>This is the content for Tab 3</div>
      ),
    },
  ],
  onClose: () => alert("PageContainer closed"),
};
