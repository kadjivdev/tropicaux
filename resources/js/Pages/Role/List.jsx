import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import { cilAlignCenter, cilLibraryAdd, cilList, cilPencil } from "@coreui/icons";

export default function List({ roles }) {
    const authUser = usePage().props.auth.user;

    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des rôles
                </h2>
            }
        >
            <Head title="Les Rôles" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="items-center gap-4">
                            <Link className="btn btn-sm bg-success bg-hover text-white" href={route("role.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                        </div>

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Libele</th>
                                    <th scope="col">Permissions</th>
                                    <th scope="col">Utilisateurs</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    roles.map((role, index) => (
                                        <tr key={role.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td >{role.name}</td>
                                            <td>
                                                <Link href={route('role.permissions', role.id)}
                                                    className='btn btn-sm btn-light border bg-hover shadow-sm'
                                                >
                                                    <strong className="text-danger">{role.permissions?.length}</strong> <CIcon icon={cilList} />
                                                </Link>
                                            </td>
                                            <td>
                                                <Link href={route('role.users', role.id)}
                                                    className='btn btn-sm btn-light border bg-hover shadow-sm'
                                                >
                                                    <strong className="text-danger">{role.users?.length}</strong> <CIcon icon={cilList} />
                                                </Link>
                                            </td>
                                            <td>
                                                {!authUser.school_id ?
                                                    (<Dropdown>
                                                        <Dropdown.Trigger>
                                                            <span className="inline-flex rounded-md">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                                >
                                                                    <CIcon icon={cilAlignCenter} /> Gérer
                                                                </button>
                                                            </span>
                                                        </Dropdown.Trigger>

                                                        <Dropdown.Content>
                                                            {checkPermission('role.edit') ?
                                                                (<Dropdown.Link
                                                                    href={route('role.permissions', role.id)}
                                                                >
                                                                    <CIcon icon={cilPencil} /> Modifier
                                                                </Dropdown.Link>) : null
                                                            }
                                                        </Dropdown.Content>
                                                    </Dropdown>) : '---'
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
