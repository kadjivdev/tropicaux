import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cibMyspace, cilLibraryAdd } from "@coreui/icons";

export default function List({ fournisseurs }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibMyspace} /> Gestion des fournisseurs locaux
                </h2>
            }
        >
            <Head title="Les fournisseurs locaux" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('fournisseur.create') ?
                            (<div className="text-center items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("fournisseur.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }

                        <br />
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Raison sociale</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Crée par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    fournisseurs.data.map((fournisseur, index) => (
                                        <tr key={fournisseur.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{fournisseur.raison_sociale || '---'}</td>
                                            <td>{fournisseur.phone || '---'}</td>
                                            <td>{fournisseur.email || '---'}</td>
                                            <td>{fournisseur.adresse || '---'}</td>
                                            <td><span className="badge bg-light border text-dark"> {`${fournisseur.createdBy?.firstname} - ${fournisseur.createdBy?.lastname}`}</span></td>
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
