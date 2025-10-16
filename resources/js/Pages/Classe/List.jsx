import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilLibraryAdd, cilList } from "@coreui/icons";

export default function List({ classes }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des classes d'écoles
                </h2>
            }
        >
            <Head title="Les Classes d'écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('classe.create') ?
                            (<div className="  items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("classe.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Libelle</th>
                                    <th scope="col">SColarité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    classes.data.map((classe, index) => (
                                        <tr key={classe.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{classe.school?.raison_sociale ?? '---'}</td>
                                            <td>{classe.libelle}</td>
                                            <td><span className="badge bg-light text-dark border rounded"> {classe.scolarite ?? '00'} FCFA</span></td>
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
