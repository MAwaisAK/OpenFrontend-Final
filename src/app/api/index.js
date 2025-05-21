import axios from "axios";

// Axios request interceptor to add authorization header
if (typeof window !== "undefined") {
  axios.interceptors.request.use(
    function (config) {
      try {
        const { origin } = new URL(config.url);
        const allowedOrigins = ["https://openpreneurs.business"];
        const token = localStorage.getItem("access-token");

        if (allowedOrigins.includes(origin) && token) {
          config.headers.authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // if URL parsing or localStorage fails, we silently continue
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
}


export const fetchAllUsers = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/get-users`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const fetchUsers = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/adminusers`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const updateUsers = async (userId, updateData) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/userupdate/${userId}`,
      updateData
    );
    return data; // returns the updated user data
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * Create or update the single category document.
 */
export const createOrUpdateCategory = async (categoryData) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/categories`, categoryData);
    return data;
  } catch (error) {
    console.error("Error creating or updating category:", error);
    throw error;
  }
};

/**
 * Delete a specific value from an array in the category document.
 */
export const deleteCategoryItem = async (arrayName, value) => {
  try {
    const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/categories`, {
      data: { arrayName, value },
    });
    return data;
  } catch (error) {
    console.error("Error deleting category item:", error);
    throw error;
  }
};

/**
 * Fetch the support array from the category document.
 */
export const fetchSupportArray = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/categories/support`);
    return data;
  } catch (error) {
    console.error("Error fetching support array:", error);
    throw error;
  }
};

export const sendNotificationToAllUsers = async (announcement) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/notifications/send-to-all`,
      { data: announcement }
    );
    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

/**
 * Get notifications for the current user.
 */
export const getUserNotifications = async (userId) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/notifications/get-user-notifications?userId=${userId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Remove a selected notification item.
 * Expects a payload object with { type, data }.
 */
export const removeNotificationItem = async (payload, userId) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/notifications/remove-item?userId=${userId}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Error removing notification item:", error);
    throw error;
  }
};

/**
 * Remove all notifications for the current user.
 */
export const removeAllNotifications = async (userId) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/notifications/remove-all?userId=${userId}`
    );
    return data;
  } catch (error) {
    console.error("Error removing all notifications:", error);
    throw error;
  }
};

/**
 * Fetch the courses array from the category document.
 */
export const fetchCoursesArray = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/categories/courses`);
    return data;
  } catch (error) {
    console.error("Error fetching courses array:", error);
    throw error;
  }
};

/**
 * Fetch the tools array from the category document.
 */
export const fetchToolsArray = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/categories/tools`);
    return data;
  } catch (error) {
    console.error("Error fetching tools array:", error);
    throw error;
  }
};

export const fetchAllTools = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/admin-tools`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const fetchAllUSerTools = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/user-tools`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const fetchUserPrompts = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/lift-ai/getAllPrompts`
    );
    return data;
  } catch (error) {
    console.error("Error fetching user prompts:", error);
    return null;
  }
};
export const fetchAllToolsUser = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/user-tools`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const fetchAllCourses = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const fetchAllUserCourses = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/user-course`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const fetchAllCoursesbyId = async (id) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/${id}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
  }
};

export const fetchAllToolsCoursesbyId = async (id) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/${id}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
  }
};

export const deleteChatLobby = async (chatLobbyId) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/chat-lobbies/${chatLobbyId}`);
  } catch (error) {
    console.error('Error deleting chat lobby:', error.response?.data || error.message);
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/user-search`);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error.response?.data || error.message);
    throw error;
  }
};

// Create a new report
export const createSupportReport = async (reportData) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/support`,
      reportData
    );
    return data;
  } catch (error) {
    console.error("Error creating support report:", error);
    throw error;
  }
};

// Fetch all support reports
export const fetchSupportReports = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/support`
    );
    return data;
  } catch (error) {
    console.error("Error fetching support reports:", error);
    throw error;
  }
};

export const getUserReports = async (userId) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/support/user/${userId}`
  );
  return data; // assumed shape: { reports: [...] }
};

// Update status for multiple support reports
export const updateSupportReportStatus = async (reportIds, newStatus) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/support/update-status`,
      { reportIds, newStatus }
    );
    return data;
  } catch (error) {
    console.error("Error updating support report status:", error);
    throw error;
  }
};


export const fetchAllTribes = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/get-admin`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};
export const fetchUsersAllTribes = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/get-users`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const searchTribesUser = async (q) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/search`,
      { params: { q } }
    );
    return data;
  } catch (error) {
    // Optional: handle error as needed
  }
};

/**
 * POST /my-tribes/:tribeId/admins
 * Body: { userId }
 */
export const addAdminToTribe = async (tribeId, userId) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${tribeId}/admins`,
      { userId }
    );
    return data;
  } catch (error) {
    // Optional: handle error as needed
  }
};

/**
 * DELETE /my-tribes/:tribeId/admins/:userId
 */
export const removeAdminFromTribe = async (tribeId, userId) => {
  try {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${tribeId}/admins/${userId}`
    );
    return data;
  } catch (error) {
    // Optional: handle error as needed
  }
};

/**
 * GET /my-tribes/:tribeId/tribers
 */
export const fetchTribeMembers = async (tribeId) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${tribeId}/tribers`
    );
    return data;
  } catch (error) {
    // Optional: handle error as needed
  }
};

export const fetchSpecificMytribes = async (userId) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/get-user-id/${userId}`
    );
    return data; // Backend returns the array of tribes (or an object with tribes, adjust as needed)
  } catch (error) {
    console.error("Error fetching specific mytribes:", error);
    throw error;
  }
};

export const getUserTribes = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user tribes:", error);
    throw error;
  }
};

export const joinTribe = async (tribeId) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/join-tribe`, { tribeId });
    return response.data;
  } catch (error) {
    console.error("Error joining tribe:", error);
    throw error;
  }
};

// Leave a tribe: removes the tribe from the user's joined_tribes and the user from the tribe's members.
export const leaveTribe = async (tribeId) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/leave-tribe`, { tribeId });
    return response.data;
  } catch (error) {
    console.error("Error leaving tribe:", error);
    throw error;
  }
};

// Get tribe members: retrieves the members of a given tribe.
export const getTribeMembers = async (tribeId) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/tribe-members/${tribeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tribe members:", error);
    throw error;
  }
};

// Remove a member from a tribe: removes the given member from the tribe's members and optionally from the user's joined_tribes.
export const removeMemberFromTribe = async (tribeId, memberId) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/remove-member`, { tribeId, memberId });
    return response.data;
  } catch (error) {
    console.error("Error removing member from tribe:", error);
    throw error;
  }
};

export const createOrFetchChatLobby = async (userId1, userId2) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/chat-lobby`,
      { userId1, userId2 },
      { headers: { Authorization: `Bearer ${yourAuthToken}` } }
    );
    return response.data.chatLobbyId;
  } catch (error) {
    console.error("Error fetching or creating chat lobby:", error);
  }
};

export const fetchAllTestimonals = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/get-all`
    );
    return data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
  }
};

// Fetch a testimonial by ID
export const fetchTestimonalById = async (id) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/${id}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching testimonial with ID ${id}:`, error);
  }
};

// Add a new testimonial
export const addTestimonal = async (formData) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/add`,
      formData
    );
    return data;
  } catch (error) {
    console.error("Error adding testimonial:", error);
  }
};

// Update a testimonial by ID
export const updateTestimonal = async (id, formData) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/update/${id}`,
      formData
    );
    return data;
  } catch (error) {
    console.error(`Error updating testimonial with ID ${id}:`, error);
  }
};

// Delete a testimonial by ID
export const deleteTestimonal = async (id) => {
  try {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/delete/${id}`
    );
    return data;
  } catch (error) {
    console.error(`Error deleting testimonial with ID ${id}:`, error);
  }
};

// Function to fetch top products by sold quantity
export const fetchTopProductsBySold = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/product/bysold`
    );
    return data;
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const getFriendRequests = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/friend-requests`,{ params: { userId } }
    );
    return response.data; // Return friend requests
  } catch (error) {
    console.error("Error fetching friend requests:", error.response?.data || error.message);
    throw error;
  }
};

export const getFriendList = async (userId, page = 1) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/friend-list`,
      { params: { userId, page } }
    );
    return response.data; // Return friend list items
  } catch (error) {
    console.error("Error fetching friend list:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllFriendList = async (userId, page = 1) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/friendlist`,
      { params: { userId } }
    );
    return response.data; // Return friend list items
  } catch (error) {
    console.error("Error fetching friend list:", error.response?.data || error.message);
    throw error;
  }
};

export const createChatLobbyRequest = async (userId1, userId2) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/create-chat-lobby`, { userId1, userId2 });
    return response.data;
  } catch (error) {
    console.error("Error creating chat lobby", error);
    throw error;
  }
};

export const getChatLobby = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/get-chat-lobbies`,  { params: { userId } }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching chat lobby:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUsersInfoChat = async (userIds) => {
  try {
    // Normalize to comma-separated string for query param
    const idsParam = Array.isArray(userIds) ? userIds.join(',') : userIds;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/users/info`,
      {
        params: { userIds: idsParam },
      }
    );
    // Assuming the controller returns { success: true, users: [...] }
    return response.data.users;
  } catch (error) {
    console.error(
      'Error fetching users info:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendContactMessage = async (data) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/verify/contactus`, data);
    return response.data;  // Success response
  } catch (error) {
       // Error handling
  }
};

export const sendFriendRequest = async (receiverId, currentUserId) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/send-request`,
      {
        targetUserId: receiverId,
        currentUserId: currentUserId, // Pass current user ID from the client
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error.response?.data || error.message);
    throw error;
  }
};


// Accept a friend request
export const acceptFriendRequest = async (receiverId, currentUserId ) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/accept-request`,
      {
        targetUserId: receiverId,
        currentUserId: currentUserId, // Pass current user ID from the client
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error.response?.data || error.message);
    throw error;
  }
};

// Reject a friend request
export const rejectFriendRequest = async (receiverId, currentUserId ) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/reject-request`,
      {
        targetUserId: receiverId,
        currentUserId: currentUserId, // Pass current user ID from the client
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting friend request:', error.response?.data || error.message);
    throw error;
  }
};

// Block a user
export const blockUser = async (userId, currentUserId) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/block-user`,
      {
        targetUserId: userId,
        currentUserId: currentUserId,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error blocking user:', error.response?.data || error.message);
    throw error;
  }
};

export const unblockUser = async (userId, currentUserId) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/unblock-user`,
      {
        targetUserId: userId,
        currentUserId: currentUserId,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error unblocking user:', error.response?.data || error.message);
    throw error;
  }
};

export const removeFriend = async (userId, currentUserId) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/remove-friend`,
      {
        friendId: userId,
        currentUserId: currentUserId,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error unblocking user:', error.response?.data || error.message);
    throw error;
  }
};

// Function to register a new user
export const fetcRegister = async (input) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/register`,
    input
  );
  return data;
};

// Function to log in a user
export const fetchLogin = async (input) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/login`,
    input
  );
  return data;
};

// Function to fetch the logged-in user's information
export const fetchMe = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/me`
  );
  return data;
};

// Function to log out a user
export const fetchLogout = async () => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/logout`,
    {
      refresh_token: localStorage.getItem("refresh-token"),
    }
  );
  return data;
};

export const updateStatus = async (productIds) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/product/update-status`,
    {
      productIds,      // This should be a number representing the sale percentage
    }
  );
  return response.data;
};

export const updateUserPasswordAPI = async (newPassword) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/update-password`,
      { newPassword }
    );
    return data;
  } catch (error) {
    console.error("Error updating password:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserMediaAPI = async (formData) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/update-user-media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error updating user media:", error.response?.data || error.message);
    throw error;
  }
};

export const joinTribeAPI = async (tribeId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/my-tribes/join`, { tribeId });
    return data;
  } catch (error) {
    console.error("Error joining tribe:", error.response?.data || error.message);
    throw error;
  }
};

// Leave tribe API function
export const leaveTribeAPI = async (tribeId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/my-tribes/leave`, { tribeId });
    return data;
  } catch (error) {
    console.error("Error leaving tribe:", error.response?.data || error.message);
    throw error;
  }
};

// Accept tribe join request API function
export const acceptTribeRequestAPI = async (tribeId, requesterId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/my-tribes/accept-request`, { tribeId, requesterId });
    return data;
  } catch (error) {
    console.error("Error accepting tribe request:", error.response?.data || error.message);
    throw error;
  }
};

// Reject tribe join request API function
export const rejectTribeRequestAPI = async (tribeId, requesterId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/my-tribes/reject-request`, { tribeId, requesterId });
    return data;
  } catch (error) {
    console.error("Error rejecting tribe request:", error.response?.data || error.message);
    throw error;
  }
};

// Course endpoints
export const addCourseAPI = async (courseId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/courses/add`, { courseId });
    return data;
  } catch (error) {
    console.error("Error adding course:", error.response?.data || error.message);
    throw error;
  }
};

export const removeCourseAPI = async (courseId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/courses/remove`, { courseId });
    return data;
  } catch (error) {
    console.error("Error removing course:", error.response?.data || error.message);
    throw error;
  }
};

// Tool endpoints
export const addToolAPI = async (toolId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/tools/add`, { toolId });
    return data;
  } catch (error) {
    console.error("Error adding tool:", error.response?.data || error.message);
    throw error;
  }
};

export const removeToolAPI = async (toolId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/tools/remove`, { toolId });
    return data;
  } catch (error) {
    console.error("Error removing tool:", error.response?.data || error.message);
    throw error;
  }
};

// Delete account endpoint
export const deleteAccountAPI = async () => {
  try {
    const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/account`);
    return data;
  } catch (error) {
    console.error("Error deleting account:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUsernameAPI = async (newUsername) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/update-username`,
      { newUsername }
    );
    return data;
  } catch (error) {
    console.error("Error updating username:", error.response?.data || error.message);
    throw error;
  }
};

// Function to update the user's address
export const updateAddress = async (input) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/address`, // Adjust the endpoint as necessary
    input
  );
  return data;
};

export const getUserProfileForCheckerAPI = async (targetUserId) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/user/profile/${targetUserId}`);
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};

export const getAddress = async (email) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/get-address`, 
      {
        params: { email } // Pass email as a query parameter
      }
    );
    return data;
  } catch (error) {
      // Handle or rethrow the error as needed
  }
};



export const verifyEmail = async (token) => {
  try {
    // Make a GET request to the verification endpoint
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/verify/verify/${token}`);
    
    // Return the response data
    return data;
  } catch (error) {
    // Log the error details
    
    // Throw a custom error message or handle it as needed
  }
};

export const forgotPassword = async (email) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/verify/forgot-password`, { email });
    return data;
  } catch (error) {
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/verify/reset-password/${token}`,
      { newPassword, confirmPassword }
    );
    return data;
  } catch (error) {
  }
};

export const updateAccountInfo = async (firstName, lastName, displayName, newPassword) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/update-user-info`,
      { firstName, lastName, displayName, newPassword }
    );
    return data;
  } catch (error) {
  }
};

export const updateBanner = async (input) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/images/update-bannerimage`,
    input
  );
  return data;
};

export const fetchBannerImage = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/images/get-bannerimage`);
    return data; // data will contain the banner image details
  } catch (error) {
      // Optional: handle error as needed
  }
};

export const fetchTotalLogin = async (rangeType) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/total-login/${rangeType}`
    );
    return data; // Assuming the API returns the total orders data
  } catch (error) {
     
  }
};

export const deleteUserById = async (userId, token) => {
  try {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/user/${userId}`,
    );
    return data; // Assuming API responds with a success message
  } catch (error) {
    // Optionally handle/log error
    console.error("Delete user failed:", error.response?.data || error.message);
    throw error;
  }
};


export const blockUserFromTribeAPI = async (tribeId, targetUserId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/block-user`, {
      tribeId,
      targetUserId,
    });
    return data;
  } catch (error) {
    console.error("Error blocking user from tribe:", error.response?.data || error.message);
    throw error;
  }
};

// Unblock a user from a tribe (admin only)
export const unblockUserFromTribeAPI = async (tribeId, targetUserId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/unblock-user`, {
      tribeId,
      targetUserId,
    });
    return data;
  } catch (error) {
    console.error("Error unblocking user from tribe:", error.response?.data || error.message);
    throw error;
  }
};

export const kickUserFromTribeAPI = async (tribeId, targetUserId) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/kick-user`, { tribeId, targetUserId });
    return data;
  } catch (error) {
    console.error("Error kicking user from tribe:", error.response?.data || error.message);
    throw error;
  }
};


export const getTribeMembersAPI = async (tribeId) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/members/${tribeId}`);
    return data;
  } catch (error) {
    console.error("Error fetching tribe members:", error.response?.data || error.message);
    throw error;
  }
};

export const getTribeDetailsAPI = async (tribeId) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/details/${tribeId}`);
    return data;
  } catch (error) {
    console.error("Error fetching tribe details:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllCoursesForUserAPI = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/courses`);
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch all tribers for the current user
export const getAllTribersForUserAPI = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/tribers`);
    return data;
  } catch (error) {
    console.error("Error fetching tribers:", error.response?.data || error.message);
    throw error;
  }
};

export const getRandomUserProfiles = async (page = 1, userId) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_ENDPOINT;
    if (!baseUrl) {
      throw new Error("Base endpoint is not defined in environment variables.");
    }
    const response = await axios.get(`${baseUrl}/auth/tribes-profile`, {page, user_id: userId}
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching random users:",
      error.response?.data || error.message
    );
    throw error;
  }
};



// Fetch all tribes for the current user
export const getAllTribesForUserAPI = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/tribes`);
    return data;
  } catch (error) {
    console.error("Error fetching tribes:", error.response?.data || error.message);
    throw error;
  }
};


export const getAllBlockedForUserAPI = async (userId) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/blocked`,
      { params: { userId } }
    );
    // Assuming the backend returns: { success: true, blocked: [...] }
    return data.blocked;
  } catch (error) {
    console.error("Error fetching blocked users:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchBasicPremiumPricing = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/price/basic-premium`
    );
    return data;
  } catch (error) {
    console.error("Error fetching pricing details:", error);
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/images/get-stat-number`
    );
    return {
      userCount: res.data.userCount,
      myTribesCount: res.data.myTribesCount,
      tools: res.data.tools,
      coursesCount: res.data.coursesCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const fetchLandingImages = async () => {
  try {
    const resLanding = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/images/get-landing`
    );
    const resLandingMini = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/images/get-landingmini`
    );

    return {
      landingImage: resLanding.data.landingimg,
      landingMiniImage: resLandingMini.data.landingminiimg,
    };
  } catch (error) {
    console.error("Error fetching landing images:", error);
    throw error;
  }
};


export const searchTribers = async (query, page = 1) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/search-tribers?query=${encodeURIComponent(query)}&page=${page}`
  );
  return data;
};

export const fetchAllPayments = async (status = "") => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/payment/all-payments`, {
      params: { status },
    });
    return data;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};

// Fetch payments for a specific user (optionally filtered by status)
export const fetchUserPayments = async (userId, status = "") => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/payment/user-payments`, {
      params: { userId, status },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching payments for user ${userId}:`, error);
    throw error;
  }
};

// Update the status of a specific payment
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/payment/update-payment-status`, {
      paymentId,
      status,
    });
    return data;
  } catch (error) {
    console.error(`Error updating payment status for ${paymentId}:`, error);
    throw error;
  }
};

// Request a refund for a specific payment
export const refundPayment = async (paymentId) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/payment/refund-payment`, {
      paymentId,
    });
    return data;
  } catch (error) {
    console.error(`Error processing refund for ${paymentId}:`, error);
    throw error;
  }
};

export const fetchRevenue = async (userId, status = "") => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/payment/revenue-stats`, {
      params: { userId, status },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching payments for user ${userId}:`, error);
    throw error;
  }
};

export const fetchLastFourReports = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/support/last4`);
    return data;
  } catch (error) {
    console.error("Error fetching last four reports:", error);
    throw error;
  }
};

// Fetch total number of courses
export const fetchTotalCourses = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/total-courses`);
    return data;
  } catch (error) {
    console.error("Error fetching total courses:", error);
    throw error;
  }
};

// Fetch total number of tools
export const fetchTotalTools = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/total-tools`);
    return data;
  } catch (error) {
    console.error("Error fetching total tools:", error);
    throw error;
  }
};

// Fetch total number of users
export const fetchTotalUsers = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/total-users`);
    return data;
  } catch (error) {
    console.error("Error fetching total users:", error);
    throw error;
  }
};

// Fetch total signups in the last 7 days
export const fetchTotalSignupsLast7Days = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/total-signup-last7days`);
    return data;
  } catch (error) {
    console.error("Error fetching total signups for the last 7 days:", error);
    throw error;
  }
};

// Fetch total active tribes
export const fetchTotalActiveTribes = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/total-active-tribes`);
    return data;
  } catch (error) {
    console.error("Error fetching total active tribes:", error);
    throw error;
  }
};

// Fetch random 5 tribers (full name, last name, username, profile_pic)
export const fetchRandomTribers = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/random-tribers`);
    return data;
  } catch (error) {
    console.error("Error fetching random tribers:", error);
    throw error;
  }
};

// Fetch top 8 tribes with most members
export const fetchTopTribes = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/top-tribes`);
    return data;
  } catch (error) {
    console.error("Error fetching top tribes:", error);
    throw error;
  }
};

// Fetch random 7 courses
export const fetchRandomCourses = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/random-courses`);
    return data;
  } catch (error) {
    console.error("Error fetching random courses:", error);
    throw error;
  }
};

// Fetch random 7 tools
export const fetchRandomTools = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/stats/random-tools`);
    return data;
  } catch (error) {
    console.error("Error fetching random tools:", error);
    throw error;
  }
};

export const fetchCoursesByIds = async (courseIds) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/user-courses`,
      { courseIds }
    );
    return data;
  } catch (error) {
    console.error("Error fetching user courses:", error);
    throw error;
  }
};

export const fetchAllNews = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/news`);
    return data;
  } catch (error) {
    console.error("Error fetching all news:", error);
    throw error;
  }
};

export const replaceNewsSection = async (newsId, sectionData) => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/news/${newsId}/replace`,
      sectionData
    );
    return data;
  } catch (error) {
    console.error(`Error replacing section for news ${newsId}:`, error);
    throw error;
  }
};

const ADMIN_BASE = `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/admin`;

// Admin login
export const loginAdmin = async ({ username, password}) => {
  try {
    const { data } = await axios.post(`${ADMIN_BASE}/login`, {
      username,
      password,
    });
    return data;
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
};

export const fetchCurrentAdmin = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/me`
  );
  return data.admin;
};


export const getTribesByIds = async (tribeIds) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/get-tribes-by-ids`, { tribeIds });
    return response.data; // Returns the tribes data
  } catch (error) {
    console.error('Error fetching tribes by IDs:', error);
    throw new Error('Failed to fetch tribes');
  }
};

// Refresh admin tokens
export const refreshAdminToken = async (refresh_token) => {
  try {
    const { data } = await axios.post(`${ADMIN_BASE}/refresh_token`, {
      refresh_token,
    });
    return data;
  } catch (error) {
    console.error("Error refreshing admin token:", error);
    throw error;
  }
};

// Create a new admin (super‑admin only)
export const createAdmin = async (adminPayload, level) => {
  try {
    const { data } = await axios.post(
      `${ADMIN_BASE}/create`,
      adminPayload,{
    params: { level }
  });
    return data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

// Fetch all admins
export const fetchAllAdmins = async (level) => {
  try {
     if (!level) throw new Error("Must provide level");
  const res = await axios.get(`${ADMIN_BASE}/`, {
    params: { level }
  });
  return res.data; // array of admins
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

// Update an admin's role
export const updateAdminRole = async ({ adminId, newlevel }, level) => {
  try {

    const { data } = await axios.put(
      `${ADMIN_BASE}/role`,
      { adminId, newlevel },
      { params: { level } }
    );
    return data;
  } catch (error) {
    console.error("Error updating admin role:", error);
    throw error;
  }
};

// Update admin credentials (username and/or password)
export const updateAdminCredentials = async ({ adminId, username, password,email },level) => {
  try {
    const { data } = await axios.put(
      `${ADMIN_BASE}/update`,
      { adminId, username, password,email },
      { params: { level } }
    );
    return data;
  } catch (error) {
    console.error("Error updating admin credentials:", error);
    throw error;
  }
};

// Delete an admin
export const deleteAdmin = async (adminId, level) => {
  try {
    const { data } = await axios.delete(
      `${ADMIN_BASE}/${adminId}`,
      { params: { level } }
    );
    return data;
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};

export const fetchAdminLogout = async () => {
  try {
    const { data } = await axios.post(
      `${ADMIN_BASE}/logout`,
      { refresh_token: localStorage.getItem("admin-refresh-token") }
    );
    return data;
  } catch (error) {
    console.error("Error logging out admin:", error);
    throw error;
  }
};