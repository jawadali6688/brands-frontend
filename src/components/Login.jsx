import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import store from '@/redux/store';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        console.log('logged in Data',res.data.user)
        dispatch(setAuthUser(res.data.user)); // Dispatch user data to Redux
        console.log('redux state',store.getState())
        const { role } = res.data.user; // Get the role from the logged-in user data

        // Redirect based on the user's role
        if (role === 'admin') {
          navigate('/admin/panel');
        } else if (role === 'brand') {
          navigate('/CreateBrand');
        } else {
          navigate('/home'); // Default redirect for regular users
        }

        toast.success(res.data.message);
        setInput({
          email: '',
          password: ''
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const { role } = user;

      // Automatically redirect if already logged in based on role
      if (role === 'admin') {
        navigate('/admin/panel');
      } else if (role === 'brand') {
        navigate('/CreateBrand');
      } else {
        navigate('/Brands');
      }
    }
  }, [user, navigate]);

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>FashionFusion</h1>
          <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
        </div>
        <div>
          <span className='font-medium'>Email</span>
          <Input
            type='email'
            name='email'
            value={input.email}
            onChange={changeEventHandler}
            className='focus-visible:ring-transparent my-2'
          />
        </div>
        <div>
          <span className='font-medium'>Password</span>
          <Input
            type='password'
            name='password'
            value={input.password}
            onChange={changeEventHandler}
            className='focus-visible:ring-transparent my-2'
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button>
        ) : (
          <Button type='submit'>Login</Button>
        )}

        <span className='text-center'>
          Don't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
