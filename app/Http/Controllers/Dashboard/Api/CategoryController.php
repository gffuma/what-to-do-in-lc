<?php

namespace App\Http\Controllers\Dashboard\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Category;

class CategoryController extends Controller
{
    /**
     * List categories
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getCategories(Request $request)
    {
        return Category::all();
    }

    /**
     * Get category
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function getCategory(Request $request, $id)
    {
        return Category::findOrFail($id);
    }

    /**
     * Store category
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeCategory(Request $request)
    {
        $this->validate($request, [
            'name'        => 'required|unique:categories|max:255',
            'description' => 'required',
        ]);
        $category = Category::create($request->only('name', 'description'));
        return response()->json($category, 201);
    }

    /**
     * Update category
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $this->validate($request, [
            'name'        => 'required|unique:categories,name,'.$category->id.'|max:255',
            'description' => 'required',
        ]);
        $category->fill($request->only('name', 'description'));
        $category->save();
        return $category;
    }

    /**
     * Delete category
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function deleteCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response(null, 204); // No Content
    }
}
