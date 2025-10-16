import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilArrowLeft, cilSend } from "@coreui/icons";
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function List({ role, permissions }) {
    const authUser = usePage().props.auth.user;

    const checkPermission = (name) => {
        return role.permissions.some(per => per.name == name);
    }

    const [ckeckPermissions, setCheckPermissions] = useState(permissions.map((per) => ({
        'id': per.id,
        'name': per.name,
        'description': per.description,
        'checked': checkPermission(per.name)
    })))

    const { data, setData, processing, patch } = useForm({
        name: role.name,
        permissions: ckeckPermissions
    })

    useEffect(() => {
        setData("permissions", ckeckPermissions.filter((per) => per.checked))
    }, [ckeckPermissions]);

    /**
     * DataTable hundle
     */

    const refreshPermissions = (e, permission) => {
        let newPers = ckeckPermissions.map(per =>
            per.id === permission.id
                ? { ...per, checked: !per.checked }
                : per
        );

        setCheckPermissions(newPers);
    };

    const checkAllPermissions = (e) => {
        const val = e.target.checked; // true or false
        let newPers = ckeckPermissions.map(per => ({ ...per, checked: val }));

        setCheckPermissions(newPers);
    }

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        patch(route('role.update.permissions', role.id), {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Permissions du rôle ${role.name} actualisées avec succès`,
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                console.log(e);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Les permissions associées au rôle : <small className='badge bg-light text-danger border rounded'>{role.name}</small>
                </h2>
            }
        >
            <Head title="Les Permissions" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="items-center gap-4">
                            <Link className="btn btn-sm bg-success bg-hover text-white" href={route("role.index")}> <CIcon className='' icon={cilArrowLeft} /> Retour</Link>
                        </div>

                        <form onSubmit={submit} >
                            <div className="mb-3">
                                <InputLabel htmlFor="name" value='Le libelle du rôle'><span className="text-danger">*</span></InputLabel>
                                <br />
                                <TextInput
                                    id="name"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                            </div>
                            <div className="text-center">
                                <InputLabel htmlFor="checkAll"><span className="btn btn-sm bg-success text-white shadow-sm btn-hover">Tout selectionner ou deselectionner</span></InputLabel>
                                <br />
                                <Checkbox
                                    id="checkAll"
                                    // hidden
                                    onChange={(e) => checkAllPermissions(e)}
                                />
                            </div>
                            <table className="shadow-sm table table-striped" id='myTable' style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th scope="col">N°</th>
                                        <th scope="col">Libele</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ckeckPermissions.length > 0 ?
                                            ckeckPermissions.map((per, index) => (
                                                <tr key={per.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td ><span className="badge bg-light rounded border text-dark">{per.name}</span></td>
                                                    <td >{per.description}</td>
                                                    <td>
                                                        <Checkbox
                                                            checked={per.checked}
                                                            onChange={(e) => refreshPermissions(e, per)}
                                                        />
                                                    </td>
                                                </tr>
                                            )) : (<tr><td colSpan={4} className='text-danger'>Aucune permission!</td> </tr>)
                                    }
                                </tbody>
                            </table>
                            <br />
                            {/* Bouton */}
                            {!authUser.school_id ?
                                (<div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer les modifications'}
                                    </PrimaryButton>
                                </div>) : ''
                            }
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
