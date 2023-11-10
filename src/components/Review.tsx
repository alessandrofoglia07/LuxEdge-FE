import React, { useState } from 'react';
import { Review as TReview } from '@/types';
import Rating from './Rating';
import { PencilSquareIcon as EditIcon, TrashIcon as DeleteIcon, XMarkIcon } from '@heroicons/react/20/solid';
import RatingButton from './RatingButton';

interface Props {
    review: TReview;
    modifiable?: boolean;
    onConfirm?: (text: string, rating: number) => void;
    onDelete?: () => void;
}

const Review: React.FC<Props> = ({ review, modifiable, onConfirm, onDelete }: Props) => {
    const { comment, rating, user, updatedAt } = review;
    const [text, setText] = useState<string>(comment);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newRating, setNewRating] = useState<number>(rating);

    if (modifiable) {
        if (!onConfirm) {
            throw new Error('onConfirm must be defined when modifiable is true');
        }
        if (!onDelete) {
            throw new Error('onDelete must be defined when modifiable is true');
        }
    }

    const resetEdit = () => {
        setIsEditing(false);
        setText(comment);
    };

    const enableEditing = () => {
        if (isEditing) {
            resetEdit();
        } else {
            setIsEditing(true);
        }
    };

    const handleConfirm = () => {
        setIsEditing(false);
        onConfirm!(text, newRating);
    };

    const handleDelete = () => {
        setIsEditing(false);
        onDelete!();
    };

    return (
        <div id='Review' className='w-full rounded-md border bg-slate-100 p-6 shadow-xl'>
            <div className='flex items-center justify-between'>
                <p className='text-xl font-bold'>{user.username}</p>
                {modifiable && (
                    <div className='flex items-center'>
                        <button onClick={enableEditing} className='group mx-2 h-6 w-6 p-2 text-primary-base hover:text-primary-hover'>
                            <EditIcon className='h-6 w-6 transition-all group-hover:scale-110' />
                        </button>
                        <button onClick={handleDelete} className='group mx-2 h-6 w-6 p-2 text-primary-base hover:text-primary-hover'>
                            <DeleteIcon className='h-6 w-6 transition-all group-hover:scale-110' />
                        </button>
                    </div>
                )}
            </div>
            <Rating rating={rating} className='py-2' />
            <p id='content' className='text-md pt-2 focus-visible:outline-none'>
                {comment}
            </p>
            <p className='pt-4 opacity-60'>Reviewed on {new Date(updatedAt).toUTCString().slice(0, -13) /* E.g. "Fri, 27 Oct 2023" (exclude timezone, hour and minute) */}</p>
            {isEditing && (
                <div className='mb-4 mt-12'>
                    <h3 className='text-lg font-bold tracking-tight'>Edit your review</h3>
                    <textarea
                        className='mb-6 h-40 w-full resize-none rounded-md border-2 border-slate-100 bg-slate-100 p-4 outline-none transition-all focus:shadow-xl focus:outline-none'
                        placeholder='Write your review here...'
                        spellCheck='false'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-3 md:items-center -md:flex-col'>
                                <p>Old rating: </p>
                                <Rating rating={rating} />
                            </div>
                            <div className='flex gap-3 md:items-center -md:flex-col'>
                                <p>New rating: </p>
                                <RatingButton init={rating - 1} onChange={(rating) => setNewRating(rating)} />
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-lg border-2 p-6'>
                                <button onClick={resetEdit} className='group h-8 w-8'>
                                    <XMarkIcon className='h-8 w-8 transition-transform group-hover:scale-110' />
                                </button>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className='h-12 rounded-lg bg-primary-base px-4 font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-xl'>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Review;
