import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilLibraryAdd, cilList } from "@coreui/icons";

export default function List({ devoirs }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des devoirs
                </h2>
            }
        >
            <Head title="Les Devoirs d'écoles" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('devoir.create') ?
                            (<div className="items-center gap-4">
                                <Link className="btn btn-sm bg-success bg-hover text-white" href={route("devoir.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Apprenant</th>
                                    <th scope="col">Trimestre</th>
                                    <th scope="col">Matiere</th>
                                    <th scope="col">Note</th>
                                    <th scope="col">Inseré par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    devoirs.data.map((devoir, index) => (
                                        <tr key={devoir.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{devoir.school?.raison_sociale ?? '---'}</td>
                                            <td>{`${devoir.apprenant?.firstname} - ${devoir.apprenant?.lastname}`}</td>
                                            <td>{devoir.trimestre?.libelle}</td>
                                            <td>{devoir.matiere?.libelle}</td>
                                            <td><span className="badge bg-light text-dark border rounded"> {devoir.note ?? '00'}</span></td>
                                            <td><span className="badge bg-light text-dark border rounded"> {`${devoir.createdBy?.firstname} - ${devoir.createdBy?.lastname}`}</span></td>
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
