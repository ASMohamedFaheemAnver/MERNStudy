import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "./types";

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("api/posts");

    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    console.log(err.response);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    console.log(err.response);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`api/posts/like/${postId}`);

    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`api/posts/unlike/${postId}`);

    dispatch({ type: UPDATE_LIKES, payload: { id: postId, likes: res.data } });
  } catch (err) {
    console.log(err.response);
    dispatch(setAlert(err.response.data.msg, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const deletePost = (postId) => async (dispatch) => {
  try {
    const res = await axios.delete(`api/posts/${postId}`);

    dispatch({ type: DELETE_POST, payload: { id: postId } });
    dispatch(setAlert("Post removed.", "success"));
  } catch (err) {
    console.log(err.response);
    dispatch(setAlert(err.response.data.msg, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("api/posts", formData);

    dispatch({ type: ADD_POST, payload: res.data });
    dispatch(setAlert("Post added.", "success"));
  } catch (err) {
    console.log(err.response);
    dispatch(setAlert(err.response.data.msg, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/commants/${postId}`, formData);

    dispatch({ type: ADD_COMMENT, payload: res.data });
    dispatch(setAlert("Commant added.", "success"));
  } catch (err) {
    console.log(err.response);
    dispatch(setAlert(err.response.data.msg, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/posts/commants/${postId}/${commentId}`
    );

    dispatch({ type: REMOVE_COMMENT, payload: commentId });
    dispatch(setAlert("Comment removed.", "success"));
  } catch (err) {
    console.log(err.response);
    dispatch(setAlert(err.response.data.msg, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
