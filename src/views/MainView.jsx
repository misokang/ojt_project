import {Fragment} from "react";
import PostList from "@/components/Post/PostList.jsx";
import AddForm from "@/components/Post/AddForm.jsx";

const MainView = () => {
    const mode = "R";

    return (
        <Fragment>
            {mode === "I" || mode === "U" ? <AddForm /> : null}
            <PostList />
        </Fragment>
    );
};
export default MainView;
