import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Notifications() {
  return (
    <div>
      <h2 className="mb-8">Set new password</h2>
      <div className="mb-10 max-w-sm">
        <Input placeholder="Current password" />
      </div>

      <div className="mb-10 max-w-sm">
        <Input placeholder="New password" />
      </div>

      <div className="mb-10 max-w-sm">
        <Input placeholder="Confirm password" />
      </div>

      <div className="flex justify-end">
        <Button
          className="app_auth_login__btn"
          size="md"
          backgroundColor="primary-blue-500"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
