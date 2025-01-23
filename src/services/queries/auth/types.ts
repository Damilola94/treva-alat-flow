export interface CreateUserBody {
  firstName: string;
  lastName: string;
  accountType: string;
  email: string;
  password: string;
  professionIds: string[];
  organization: {
    name: string;
    organizationSizeId: string;
  };
}
