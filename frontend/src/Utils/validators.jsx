/**
 * Industry Standard Frontend Validation Suite
 * Focus: Clean Data & User Feedback
 */

export const validateProduct = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters.";
  }

  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    errors.price = "Please enter a valid price greater than 0.";
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = "Description should be at least 10 characters.";
  }

  if (!data.category) {
    errors.category = "Please select a category.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePost = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = "Post title is too short.";
  }

  if (!data.content || data.content.trim().length < 20) {
    errors.content = "Blog content must be at least 20 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Helper for Email (Great for your Messages/Contact section)
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
