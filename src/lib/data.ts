import { get, writable } from 'svelte/store';

export interface template{
    id?: string
    name: string,
    grid_size: number,
    questions: Record<string, Array<{answer: string, question: string}>>
}

export const database = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("Games", 1);

    request.onupgradeneeded = (event) => {
        //@ts-ignore
        const upgradeDB: IDBDatabase = event.target.result;

        if(!upgradeDB.objectStoreNames.contains("templates"))
            upgradeDB.createObjectStore("templates", { keyPath: "id" });
    }

    request.onerror = (event) => {
        reject(event)
    };
    request.onsuccess = (event) => {
        //@ts-ignore
        resolve(event.target.result)
    }
})


export const templateStore = (() => {
    const store = writable(new Promise<Array<template>>(async (resolve, reject) => {
        const transaction = (await database).transaction(["templates"], "readwrite");
        const action = transaction.objectStore("templates").getAll()

        action.onerror = () => {reject()}
        action.onsuccess = ({target}) => {
            //@ts-ignore
            resolve(target.result)
        }
    }));

    const getById = (id: string) => {
        //TODO: add type
        return new Promise<template | null>(async (resolve, reject) => {
            const transaction = (await database).transaction(["templates"], "readwrite");
            const action = transaction.objectStore("templates").get(id)

            action.onerror = () => {resolve(null)}
            action.onsuccess = ({target}) => {
                //@ts-ignore
                resolve(target.result)
            }
        })
    }

    return {
		subscribe: store.subscribe,
        get: getById,
        add: async (data: template) => {
            let id = crypto.randomUUID()
            while(await getById(id)){ id = crypto.randomUUID() }
            data.id = id

            const transaction = (await database).transaction(["templates"], "readwrite");
            transaction.objectStore("templates").add(data)

            const storeData = await get(store)
            storeData.push(data)
            store.set(Promise.resolve(storeData))
        },
        set: async (id: string, data: template) => {
            data.id = id

            const transaction = (await database).transaction(["templates"], "readwrite");
            transaction.objectStore("templates").put(data)

            const storeData = await get(store)
            for (const index in storeData) {
                if(storeData[index].id !== id)
                    continue

                storeData[index] = data
                break
            }

            store.set(Promise.resolve(storeData))
        },
        delete: async (id: string) => {
            const transaction = (await database).transaction(["templates"], "readwrite");
            transaction.objectStore("templates").delete(id)

            const storeData = await get(store)
            for (const index in storeData) {
                if(storeData[index].id !== id)
                    continue

                //@ts-ignore
                storeData.splice(index, 1)
                break
            }

            store.set(Promise.resolve(storeData))
        }
	};
})()
