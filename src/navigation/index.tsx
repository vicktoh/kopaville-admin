import { collection, onSnapshot } from "firebase/firestore";
import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import { CategoriesPage } from "../pages/CategoriesPage";
import { Dashboard } from "../pages/Dashboard";
import { HistoryVille } from "../pages/HistoryVille";
import { Jobs } from "../pages/Jobs";
import { Layout } from "../pages/Layout";
import { MarketPlace } from "../pages/MarketPlace";
import { MarketPlaceLayout } from "../pages/MarketPlaceLayout";
import { Orders } from "../pages/Orders";
import { PostReportPage } from "../pages/PostReportPage";
import { ReportLayout } from "../pages/ReportLayout";
import { UserReportPage } from "../pages/UserReportPage";
import { Users } from "../pages/Users";
import { setCategories } from "../reducers/categoriesSlice";
import { useAppSelector } from "../reducers/types";
import { db } from "../services/firebase";
import { Category } from "../types/Category";

const MainRoutes: FC = () => {
  const { categories } = useAppSelector(({ categories }) => ({ categories }));
  const dispatch = useDispatch();

  useEffect(() => {
    function listenOnCategories() {
      const categoriesCollection = collection(db, "categories");
      onSnapshot(categoriesCollection, (querysnaphot) => {
        const cats: Category[] = [];
        const categoriesMap: { [key: string]: string } = {};
        querysnaphot.forEach((snap) => {
          const category = snap.data() as Category;
          category.categoryId = snap.id;
          cats.push(category);
          categoriesMap[snap.id] = category.title;
        });
        dispatch(setCategories({ categories: cats, map: categoriesMap }));
      });
    }
    if (!categories) {
      listenOnCategories();
    }
  }, [dispatch, categories]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard">
            <Route element={<Dashboard />} index />
          </Route>
          <Route path="users" element={<Users />}></Route>
          <Route path="jobs" element={<Jobs />}></Route>
          <Route path="comments" element={<Users />}></Route>
          <Route path="reports" element={<ReportLayout />}>
            <Route index element={<PostReportPage />} />
            <Route path="users" element={<UserReportPage />} />
          </Route>
          <Route path="/market" element={<MarketPlaceLayout />}>
            <Route index element={<MarketPlace />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="vendors" element={<MarketPlace />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="historyville" element={<HistoryVille />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
