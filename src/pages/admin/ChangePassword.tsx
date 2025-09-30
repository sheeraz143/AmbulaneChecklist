import { useForm } from "react-hook-form";

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword(): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>();

  const newPassword = watch("newPassword");

  const onSubmit = (data: ChangePasswordForm) => {
    alert(`✅ Password changed successfully!
Old: ${data.oldPassword}
New: ${data.newPassword}`);
    // TODO: integrate API to update password
  };

  return (
    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Change Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Old Password */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            {...register("oldPassword", { required: "Old password is required" })}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="Enter your old password"
          />
          {errors.oldPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            New Password
          </label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="Enter your new password"
          />
          {errors.newPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Re-enter New Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="Confirm your new password"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-transform hover:scale-105 shadow-lg"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
