import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilList, } from "@coreui/icons";

export default function List({ fournisseur,total_amount }) {
    const permissions = usePage().props.auth.permissions;

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
                    <CIcon className='text-success' icon={cilList} /> Gestion des financements du fournisseur <span className="badge bg-light border rounded text-success">{fournisseur.raison_sociale}</span> | Total: <span className="badge bg-light border rounded text-success">{total_amount}</span>
                </h2>
            }
        >
            <Head title="Les Financements" />

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
                                    <th scope="col">Gestionnaire</th>
                                    <th scope="col">Montant</th>
                                    <th scope="col">Date de financement</th>
                                    <th scope="col">Preuve</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    fournisseur.financements && fournisseur.financements.map((financement, index) => (
                                        <tr key={financement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm"> {financement?.reference ?? '---'}</span> </td>
                                            <td>{`${financement?.gestionnaire?.lastname} - ${financement?.gestionnaire?.firstname}`}</td>
                                            <td>{financement.montant}</td>
                                            <td>{financement.date_financement}</td>
                                            <td>
                                                {financement.document ? (
                                                    <a
                                                        className='btn btn-sm shadow border rounded text-dark'
                                                        target='_blank'
                                                        href={financement.document}
                                                    >
                                                        <CIcon className='text-success' icon={cilCloudDownload} />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">---</span>
                                                )}
                                            </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.created_by?.firstname} - ${financement.created_by?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${getDate(financement.validated_at) || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.validated_by?.firstname || ''} - ${financement.validated_by?.lastname || ''}`}</span> </td>
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