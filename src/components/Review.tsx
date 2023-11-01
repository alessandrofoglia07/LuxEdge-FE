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
        <div id='Review' className='bg-slate-100 border shadow-xl w-full p-6 rounded-md'>
            <div className='flex items-center justify-between'>
                <p className='text-xl font-bold'>{user.username}</p>
                {modifiable && (
                    <div className='flex items-center'>
                        <button onClick={enableEditing} className='w-6 h-6 p-2 mx-2 group text-primary-base hover:text-primary-hover'>
                            <EditIcon className='w-6 h-6 group-hover:scale-110 transition-all' />
                        </button>
                        <button onClick={handleDelete} className='w-6 h-6 p-2 mx-2 group text-primary-base hover:text-primary-hover'>
                            <DeleteIcon className='w-6 h-6 group-hover:scale-110 transition-all' />
                        </button>
                    </div>
                )}
            </div>
            <Rating rating={rating} className='py-2' />
            <p id='content' className='pt-2 text-md focus-visible:outline-none'>
                {comment}
            </p>
            <p className='pt-4 opacity-60'>Reviewed on {new Date(updatedAt).toUTCString().slice(0, -13) /* E.g. "Fri, 27 Oct 2023" (exclude timezone, hour and minute) */}</p>
            {isEditing && (
                <div className='mt-12 mb-4'>
                    <h3 className='text-lg font-bold tracking-tight'>Edit your review</h3>
                    <textarea
                        className='w-full h-40 bg-slate-100 border-2 border-slate-100 rounded-md p-4 mb-6 resize-none focus:outline-none focus:shadow-xl transition-all outline-none'
                        placeholder='Write your review here...'
                        spellCheck='false'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex md:items-center -md:flex-col gap-3'>
                                <p>Old rating: </p>
                                <Rating rating={rating} />
                            </div>
                            <div className='flex md:items-center -md:flex-col gap-3'>
                                <p>New rating: </p>
                                <RatingButton init={rating - 1} onChange={(rating) => setNewRating(rating)} />
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 p-6 flex items-center justify-center border-2 rounded-lg'>
                                <button onClick={resetEdit} className='w-8 h-8 group'>
                                    <XMarkIcon className='w-8 h-8 group-hover:scale-110 transition-transform' />
                                </button>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className='px-4 h-12 bg-primary-base hover:bg-primary-hover rounded-lg text-white font-semibold hover:shadow-xl transition-all'
                            >
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
