import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import {
  createStory,
  getAllStories,
  imageUpload,
} from "../../../services/operations/admin";

function AddStory() {
  const [openCreate, setCreate] = useState(false);
  const { token, user } = useSelector((state) => state.auth);

  const [newStory, setNewStory] = useState({
    title: [""],
    author: "",
    images: [],
  });

  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const response = await getAllStories();
        setStories(response || []);
        console.log(response);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setStories([]);
      }
    };

    fetchAllStories();
  }, []);

  const uploadImage = async (acceptedFiles) => {
    try {
      const response = await imageUpload(acceptedFiles);
      const uploadedImages = response?.map((image) => ({
        public_id: image.asset_id,
        url: image.url,
      }));
      setNewStory((prevStory) => ({
        ...prevStory,
        images: [...prevStory.images, ...uploadedImages],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const removeImage = (publicId) => {
    setNewStory((prevStory) => ({
      ...prevStory,
      images: prevStory.images.filter((image) => image.public_id !== publicId),
    }));
  };

  const handleCreateStory = async () => {
    try {
      const storyData = {
        ...newStory,
        title: newStory.title.join(", "), // Join titles into a single string
        images: JSON.stringify(newStory.images),
      };

      await createStory(storyData, token);
      setNewStory({ title: [""], author: "", images: [] });
      const response = await getAllStories();
      setStories(response || []);
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  const addTitle = () => {
    setNewStory((prevStory) => ({
      ...prevStory,
      title: [...prevStory.title, ""],
    }));
  };

  const removeTitle = (index) => {
    setNewStory((prevStory) => ({
      ...prevStory,
      title: prevStory.title.filter((_, i) => i !== index),
    }));
  };

  const handleTitleChange = (index, value) => {
    const updatedTitles = [...newStory.title];
    updatedTitles[index] = value;
    setNewStory((prevStory) => ({
      ...prevStory,
      title: updatedTitles,
    }));
  };

  return (
    <div className="w-11/12 mx-auto p-4">
      <div className="text-center text-2xl font-semibold underline mb-4">
        <h4>Stories</h4>
      </div>

      <div className="flex justify-end mb-4">
        {user?.permissions?.canAdd && (
          <button
            onClick={() => setCreate(!openCreate)}
            className="flex items-center gap-2 p-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 focus:outline-none"
          >
            <FaPlusCircle /> Create Story
          </button>
        )}
      </div>

      {openCreate && (
        <div className="mb-4 p-4 border rounded-lg">
          <h5 className="text-xl font-semibold mb-2">Create Story</h5>

          {/* Dynamic Titles */}
          {newStory.title.map((title, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder={`Title ${index + 1}`}
                value={title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                className="w-full p-2 border rounded focus:outline-none"
              />
              {index > 0 && (
                <button
                  onClick={() => removeTitle(index)}
                  className="p-2 bg-red-500 text-white rounded-lg"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addTitle}
            className="flex items-center gap-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
          >
            <FaPlusCircle /> Add Another Title
          </button>

          <input
            type="text"
            placeholder="Author"
            value={newStory.author}
            onChange={(e) =>
              setNewStory({ ...newStory, author: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded focus:outline-none"
          />

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Upload Images
            </label>
            <div className="bg-white border-2 border-blue-600 p-4">
              <Dropzone onDrop={(acceptedFiles) => uploadImage(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section className="text-center">
                    <div {...getRootProps()} className="cursor-pointer">
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>

            <div className="flex gap-4 mt-4 flex-wrap">
              {newStory.images.map((image, index) => (
                <div key={index} className="relative w-40 h-40">
                  <img
                    src={image.url}
                    alt={`Uploaded ${index}`}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => removeImage(image.public_id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateStory}
            className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          >
            Create
          </button>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Titles</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Images</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story._id} className="hover:bg-gray-100">
                <td className="py-4 px-6">
                  {Array.isArray(story.title)
                    ? story.title.join(", ")
                    : "No Title"}{" "}
                </td>
                <td className="py-4 px-6">
                  {story.author} -{" "}
                  {new Date(story.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <img
                    src={story?.images[0]?.url}
                    alt={`Story Image`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddStory;
