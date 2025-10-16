import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilArrowLeft, cilSend } from "@coreui/icons";
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function List({ role }) {

    console.log(role)

    const [ckeckUsers, setCheckUsers] = useState(role.users.map((user) => ({
        'id': user.id,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'school': user.school,
        'detail': user.detail,
        'checked': true
    })))

    const { data, errors, setData, processing, post, patch } = useForm({
        users: ckeckUsers
    })

    useEffect(() => {
        setData("users", ckeckUsers.filter((user) => user.checked))
    }, [ckeckUsers]);


    const refreshUsers = (e, user) => {
        let newPers = ckeckUsers.map(_u =>
            _u.id === user.id
                ? { ..._u, checked: !_u.checked }
                : _u
        );

        setCheckUsers(newPers);
    };

    const checkAllUsers = (e) => {
        const val = e.target.checked; // true or false
        let newPers = ckeckUsers.map(per => ({ ...per, checked: val }));

        setCheckUsers(newPers);
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

        patch(route('role.update.users', role.id), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Users du rôle ${role.name} actualisées avec succès`,
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
                    <CIcon className='text-success' icon={cilList} /> Les users associées au rôle : <em>{role.name}</em>
                </h2>
            }
        >
            <Head title="Les Users" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="items-center gap-4">
                            <Link className="btn btn-sm bg-success bg-hover text-white" href={route("role.index")}> <CIcon className='' icon={cilArrowLeft} /> Retour</Link>
                        </div>

                        <form onSubmit={submit} >
                            <div className="text-center">
                                <InputLabel htmlFor="checkAll"><span className="btn btn-sm bg-success text-white shadow-sm btn-hover">Tout selectionner ou deselectionner</span></InputLabel>
                                <br />
                                <Checkbox
                                    id="checkAll"
                                    // hidden
                                    onChange={(e) => checkAllUsers(e)}
                                /></div>
                            <table className="shadow-sm table table-striped" id='myTable' style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th scope="col">N°</th>
                                        <th scope="col">Nom & Prénom</th>
                                        <th scope="col">Ecole</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ckeckUsers.length > 0 ?
                                            ckeckUsers.map((user, index) => (
                                                <tr key={user.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td ><span className="badge bg-light rounded border text-dark">{`${user.firstname} - ${user.lastname}`}</span></td>
                                                    <td><span className="badge bg-light text-dark border rounded">{user.school?.raison_sociale || '---'} </span> </td>
                                                    <td><span className="badge bg-light text-dark border rounded">{user.detail?.phone} </span> </td>
                                                    <td>
                                                        <Checkbox
                                                            checked={user.checked}
                                                            onChange={(e) => refreshUsers(e, user)}
                                                        />
                                                    </td>
                                                </tr>
                                            )) : (<tr><td colSpan={4} className='text-danger'>Aucun utilisateur!</td> </tr>)
                                    }
                                </tbody>
                            </table>
                            <br />
                            {/* Bouton */}
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer les modifications'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
