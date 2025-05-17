import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h2>
          <p className="mt-2 text-sm text-gray-500">
            요청하신 페이지가 존재하지 않거나, 이동되었거나, 이름이 변경되었을 수 있습니다.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            홈으로 돌아가기
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-500">문제가 계속되면 관리자에게 문의하세요.</p>
        </div>
      </div>
    </div>
  );
};
