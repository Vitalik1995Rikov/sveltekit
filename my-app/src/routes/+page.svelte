<script lang="ts">
    import { onMount } from "svelte";

    import type { User } from "$lib/users";

    let users: User[] = $state([]);
    let loading = $state(false);
    let error: string | null = $state(null);
    let page = $state(1);
    let totalPages = $state(1);

    let sortField: keyof User = $state('firstName');
    let sortDirection: 'asc' | 'desc' = $state('asc');

    const loadUsers = async () => {
        loading = true;
        error = null;

        try {
            const res = await fetch(`/api/users?page=${page}&sortField=${sortField}&sortDirection=${sortDirection}`);
            if (!res.ok) throw new Error('Не удалось загрузить пользователей');
            const data = await res.json();
            users = data.data;
            totalPages = data.totalPages;
        } catch(err) {
            error = err instanceof Error ? err.message : 'Произошла ошибка';
        } finally {
            loading = false;
        }
    }

    const prevPage = () => {
        if (page > 1) {
            page = page - 1;
            loadUsers();
        }
    }

    const nextPage = () => {
        if (page < totalPages) {
            page = page + 1;
            loadUsers();
        }
    }

    const toggleSort = (field: keyof User) => {
        if (field === sortField) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
        } else {
            sortField = field;
            sortDirection = 'asc'
        }
        page = 1;
        loadUsers();
    }

    onMount(() => {
        loadUsers()
    })
</script>

{#if loading}
    <p>Loading ...</p>
{:else if error}
    <p class="text-red-500">Ошибка: {error}</p>
{:else}
<div class="overflow-x-auto shadow-md rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th class="px-6 py-3" onclick={() => toggleSort('firstName')}>Имя</th>
                <th class="px-6 py-3" onclick={() => toggleSort('lastName')}>Фамилия</th>
                <th class="px-6 py-3" onclick={() => toggleSort('city')}>Город</th>
                <th class="px-6 py-3" onclick={() => toggleSort('age')}>Возраст</th>
                <th class="px-6 py-3" onclick={() => toggleSort('job')}>Работа</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-6 py-4">{user.firstName}</td>
                    <td class="px-6 py-4">{user.lastName}</td>
                    <td class="px-6 py-4">{user.city}</td>
                    <td class="px-6 py-4">{user.age}</td>
                    <td class="px-6 py-4">{user.job}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
<button onclick={prevPage} disabled={page === 1}>prevPage</button>
<span>Page {page} / {totalPages}</span>
<button onclick={nextPage} disabled={page === totalPages}>nextPage</button>
{/if}
