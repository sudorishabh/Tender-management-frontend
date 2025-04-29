import SigninForm from "@/components/Auth/Signin/SigninForm";
import Heading from "@/components/Shared/Heading";

const SignIn = () => {
  return (
    <div className='pt-[3.8rem]'>
      {/* <Protected> */}
      <Heading
        title='TERI - Tender Management'
        description='A platform for venders to bid'
        keywords='Tender, Vender, Projects'
      />
      <SigninForm />
      {/* </Protected> */}
    </div>
  );
};

export default SignIn;
