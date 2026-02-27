import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilList, } from "@coreui/icons";

export default function List({ fournisseur, chargements, total_amount }) {
    const permissions = usePage().props.auth.permissions;

    console.log("Les chargements : ", chargements.data)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const getDate = (d) => {
        let dateFr = null
        if (d) {
            const date = new Date(d);
            dateFr = date.toLocaleString('fr-FR', {
                dateStyle: 'short',
                timeStyle: 'short'
            });
        }

        return dateFr;
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des chargments du fournisseur <span className="badge bg-light border rounded text-success">{fournisseur.raison_sociale}</span> | Total: <span className="badge bg-light border rounded text-success">{total_amount}</span>
                </h2>
            }
        >
            <Head title="Les Chargements" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="text-center  items-center gap-4">
                            <Link className="btn w-50 bg-success bg-hover text-white" href={route("fournisseur.index")}> <CIcon className='' icon={cilList} /> Liste des fournisseurs</Link>
                        </div>

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Produit</th>
                                    <th scope="col">Chauffeur</th>
                                    <th scope="col">Superviseur</th>
                                    <th scope="col">Montant total</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    chargements.data && chargements.data?.map((chargement, index) => (
                                        <tr key={chargement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm"> {chargement?.reference ?? '---'}</span> </td>
                                            <td>{chargement?.produit?.libelle ?? '---'}</td>
                                            <td>{`${chargement?.chauffeur?.raison_sociale}`}</td>
                                            <td>{`${chargement?.superviseur?.raison_sociale}`}</td>
                                            <td> <span className="badge bg-light shadow rounded border text-success"> {chargement.montant_chargement}</span></td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.createdBy?.firstname} - ${chargement.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{chargement.validated_at || '---'}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.validatedBy?.firstname || ''} - ${chargement.validatedBy?.lastname || ''}`}</span> </td>
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