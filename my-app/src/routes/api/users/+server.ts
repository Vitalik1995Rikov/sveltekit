import { getUsers } from "$lib/users";
import { json } from "@sveltejs/kit";

export function GET({url}: {url: URL}) {
    let allUsers = getUsers();

    const sortField = url.searchParams.get('sortField') || 'firstName';
    const sortDirection = url.searchParams.get('sortDirection') || 'asc';

    if (sortField) {
        allUsers = [...allUsers].sort((a, b) => {
            let aValue = a[sortField as keyof typeof a];
            let bValue = b[sortField as keyof typeof b];
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();
            
            if (sortDirection === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }

    const page = Number(url.searchParams.get('page') || 1);
    const limit = 10;

    const start = (page - 1) * limit;
    const end = start + limit;

    const partOfUsers = allUsers.slice(start, end);

    return json({data: partOfUsers, page, totalCount: allUsers.length, totalPages: Math.ceil(allUsers.length / limit), sortField: sortField,
        sortDirection: sortDirection})
}