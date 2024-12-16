import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' // Default role is 'user'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(res);
      if (res?.data?.success) {
        navigate('/login');
        toast.success(res?.data?.message);
        setInput({
          username: '',
          email: '',
          password: '',
          role: 'user' // Reset role to default after signup
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>FashionFusion</h1>
          <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
        </div>
        <div>
          <span className='font-medium'>Username</span>
          <Input
            type='text'
            name='username'
            value={input.username}
            onChange={changeEventHandler}
            className='focus-visible:ring-transparent my-2'
          />
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
        <div>
          <span className='font-medium'>Select Role</span>
          <select
            name='role'
            value={input.role}
            onChange={changeEventHandler}
            className='focus-visible:ring-transparent my-2 p-2 border border-gray-300 rounded-md'
          >
            <option value='user'>User</option>
            <option value='brand'>Brand</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        {loading ? (
          <Button>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button>
        ) : (
          <Button type='submit'>Signup</Button>
        )}
        <span className='text-center'>
          Already have an account? <Link to='/login' className='text-blue-600'>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
