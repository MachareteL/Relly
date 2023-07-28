import type { NextPage } from "next";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { api } from "~/utils/api";
import { type ChangeEvent, useState } from "react";

const Settings: NextPage = ({}) => {
  // const { data: user } = api.user.getUser.useQuery();
  const updateProfile = api.user.updateProfile.useMutation();
  const [userProfile, setUserProfile] = useState<{
    name: string;
    image?: string;
  }>({ name: "noname" });
  function handleUpdateUser() {
    updateProfile.mutate(userProfile);
  }
  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    console.log("chamou funcao");
    const files = e.target.files;
    if (!files) {
      console.log("no file");
      return;
    }
    const imageFile = files[0];
    if (!imageFile) {
      console.log("no img");
      return;
    }
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      setUserProfile({ ...userProfile, image: fileReader.result?.toString() });
    });
    fileReader.readAsDataURL(imageFile);
  }

  return (
    <div className="container m-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <form
        onSubmit={handleUpdateUser}
        className="flex flex-col rounded-md border border-white bg-gradient-to-tl from-[rgba(255,255,255,0.2)] to-[rgba(0,0,0,0.2)] p-4"
      >
        <div>
          <h1 className="py-2 text-3xl font-thin">Profile</h1>
          <h3 className="font-thin">
            This is the public information will be displayed in your personal
            profile and public posts
          </h3>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="name"
              className="block text-start text-sm font-medium leading-6"
            >
              Name
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, name: e.target.value })
                  }
                  className="block flex-1 border-0 bg-transparent px-4 py-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="John Smith"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="block">
          <h1 className="mt-4 block text-start text-sm font-medium leading-6 text-gray-200">
            Photo
          </h1>
          <div className="flex items-center gap-x-3 pt-2">
            <input
              type="file"
              className="hidden"
              name="photo"
              id="photo"
              onChange={(e) => handleFileInput(e)}
            />
            {userProfile.image ? (
              <img src={userProfile.image} className="relative h-12 w-12 rounded-full" alt=""/>
            ) : (
              <UserCircleIcon
                className="relative h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
            )}
            <label
              htmlFor="photo"
              className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Change
            </label>
          </div>
        </div>

        <div className="mt-2">
          <label
            htmlFor="cover-photo"
            className="block text-sm font-medium leading-6"
          >
            Cover photo
          </label>
          <div className="border-white-900/25 mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
            <div className="text-center">
              <PhotoIcon
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-200">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white px-2 font-semibold text-gray-600 focus-within:outline-none focus-within:ring-2 hover:opacity-80"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-200">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 self-end rounded-md bg-black px-4 py-2 text-white hover:bg-[rgb(29,28,28)]"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Settings;
