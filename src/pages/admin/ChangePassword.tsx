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
    alert(`Password changed successfully!\nOld: ${data.oldPassword}\nNew: ${data.newPassword}`);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Old Password */}
        <div>
          <label className="block mb-1 font-medium">Old Password</label>
          <input
            type="password"
            {...register("oldPassword", { required: "Old password is required" })}
            className="w-full border rounded p-2 outline-none"
          />
          {errors.oldPassword && (
            <p className="text-red-600 text-sm">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="w-full border rounded p-2 outline-none"
          />
          {errors.newPassword && (
            <p className="text-red-600 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block mb-1 font-medium">Re-enter New Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            className="w-full border rounded p-2 outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
