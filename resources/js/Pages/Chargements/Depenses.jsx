import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilList, } from "@coreui/icons";

export default function List({ chargement, total_amount }) {
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
                    <CIcon className='text-success' icon={cilList} /> Gestion des fonds aloués au chargement <span className="badge bg-light border rounded text-success">{chargement.reference}</span> | Total: <span className="badge bg-light border rounded text-success">{total_amount}</span>
                </h2>
            }
        >
            <Head title="Les Fonds aux superviseurs" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="text-center  items-center gap-4">
                            <Link className="btn w-50 bg-success bg-hover text-white" href={route("chargement.index")}> <CIcon className='' icon={cilList} /> Liste des chargements</Link>
                        </div>

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Superviseur</th>
                                    <th scope="col">Montant</th>
                                    <th scope="col">Preuve</th>
                                    <th scope="col">Observation</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    chargement.depenses?.length > 0 &&
                                    chargement.depenses?.map((depense, index) => (
                                        <tr key={depense.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm"> {depense.reference ?? '---'}</span> </td>
                                            <td>{depense?.superviseur?.raison_sociale ?? '---'}</td>
                                            <td>{depense.montant}</td>
                                            <td>
                                                {depense.document ? (
                                                    <a
                                                        className='btn btn-sm shadow border rounded text-dark'
                                                        target='_blank'
                                                        href={depense.document}
                                                    >
                                                        <CIcon className='text-success' icon={cilCloudDownload} />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">---</span>
                                                )}
                                            </td>
                                            <td> <textarea rows={1} className='form-control' disabled={true} placeholder={depense.commentaire || '---'}></textarea> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${depense.created_by?.firstname} - ${depense.created_by?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${depense.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${depense.validated_by?.firstname || ''} - ${depense.validated_by?.lastname || ''}`}</span> </td>
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