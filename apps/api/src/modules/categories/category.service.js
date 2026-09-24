import { AppError } from '../../shared/errors/app-error.js';
import * as categoryRepository from './category.repository.js';

export async function listCategories() {
    return await categoryRepository.listCategories()
}

export async function getCategoryById(id) {
    const category = await categoryRepository.findCategoryById(id)
    if (!category) {
        throw new AppError({
            statusCode: 404,
            code: 'CATEGORY_NOT_FOUND',
            message: `Categoria no encontrada`
        })
    }
    return category
}

export async function createCategory(data) {
    const exists = await categoryRepository.findCategoryBySlug(data.slug)
    if (exists) {
        throw new AppError({
            statusCode: 404,
            code: 'CATEGORY_SLUG_EXISTS',
            message: `Ya existe una categoría con el slug `
        })
    }
    return categoryRepository.createCategory(data)
}

export async function updateCategory(id, data) {
    await getCategoryById(id)
    if (data.slug) {
        const exists = await categoryRepository.findCategoryBySlug(data.slug)

        if (exists && exists.id !== id) {
            throw new AppError({
                statusCode: 409,
                code: 'CATEGORY_SLUG_EXISTS',
                message: `Ya existe una categoría con el slug `
            })
        }
    }
    return categoryRepository.updateCategory(id, data)
}

export async function deleteCategory(id) {
    await getCategoryById(id)
    await categoryRepository.deleteCategory(id)
}


