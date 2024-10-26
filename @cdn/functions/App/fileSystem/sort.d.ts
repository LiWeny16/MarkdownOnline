type ExtendedTreeItemProps = {
    label: string;
    children?: ExtendedTreeItemProps[];
};
declare const sortFileDirectoryArr: (arr: ExtendedTreeItemProps[]) => ExtendedTreeItemProps[];
export default sortFileDirectoryArr;
